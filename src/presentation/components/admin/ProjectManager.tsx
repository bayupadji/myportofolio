"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
  X,
  Save,
  Loader2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Project } from "@/domain/entities/Project";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";
import { ImageUploadDropzone } from "./ImageUploadDropzone";

interface ProjectManagerProps {
  initialProjects: Project[];
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  initialProjects,
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft" | "sample">("all");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<"basic" | "tldr" | "sections" | "review">("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.en.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === "published") return p.status === "published";
    if (filterStatus === "draft") return p.status === "draft";
    if (filterStatus === "sample") return p.isSampleProject;
    return true;
  });

  const handleToggleStatus = async (id: string, currentStatus: PublishStatus) => {
    const newStatus: PublishStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus proyek "${title}" secara permanen?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const handleOpenNew = () => {
    const newEmptyProject: Project = {
      id: `proj-${Date.now()}`,
      slug: "",
      title: { en: "", id: "" },
      summary: { en: "", id: "" },
      role: "Lead Product Designer",
      duration: "3 months",
      team: "1 PM, 4 Engineers",
      platforms: ["Web", "Mobile"],
      tools: ["Figma"],
      category: "Fintech",
      coverUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
      metrics: [
        {
          value: "+25%",
          label: { en: "Metric Improvement", id: "Peningkatan Metrik" },
        },
      ],
      tldr: {
        problem: { en: "", id: "" },
        solution: { en: "", id: "" },
        impact: { en: "", id: "" },
      },
      sections: [],
      solutionStates: [],
      learnings: [],
      status: "draft",
      isSampleProject: false,
      order: projects.length + 1,
      publishedAt: new Date().toISOString(),
    };
    setEditingProject(newEmptyProject);
    setActiveEditorTab("basic");
    setEditorError(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
    setActiveEditorTab("basic");
    setEditorError(null);
    setIsEditorOpen(true);
  };

  const handleSaveProject = async () => {
    if (!editingProject) return;

    if (!editingProject.title.en.trim()) {
      setActiveEditorTab("basic");
      setEditorError("Judul Proyek (English) wajib diisi!");
      return;
    }

    if (!editingProject.slug.trim()) {
      setActiveEditorTab("basic");
      setEditorError("Slug URL wajib diisi!");
      return;
    }

    setIsSaving(true);
    setEditorError(null);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan proyek");
      }

      setProjects((prev) => {
        const exists = prev.some((p) => p.id === editingProject.id);
        if (exists) {
          return prev.map((p) => (p.id === editingProject.id ? editingProject : p));
        }
        return [editingProject, ...prev];
      });

      setIsEditorOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setEditorError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Manajemen Studi Kasus
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)]">
              {projects.length} Total
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Tambah, edit, sesuaikan bahasa, dan ubah visibilitas studi kasus portofolio.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul, slug, kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "Semua" },
            { id: "published", label: "Terbit" },
            { id: "draft", label: "Draf" },
            { id: "sample", label: "Sample" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                filterStatus === tab.id
                  ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-xs text-[var(--text-muted)] space-y-3">
            <FolderGit2 className="w-8 h-8 mx-auto opacity-30" />
            <p>Tidak ada proyek yang cocok dengan pencarian.</p>
          </div>
        ) : (
          filteredProjects.map((p) => (
            <div
              key={p.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-hover)]/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.coverUrl}
                  alt={p.slug}
                  className="w-20 h-14 object-cover rounded-xl border border-[var(--border)] shrink-0 bg-zinc-800"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-sm text-[var(--text)]">
                      {p.title.en || "Untitled Project"}
                    </span>
                    {p.isSampleProject && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                        Sample project
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-500/10 text-[var(--text-muted)] border border-zinc-500/20">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Slug: <code className="font-mono text-[var(--accent)]">/{p.slug}</code> &bull; Role: {p.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Status Toggle */}
                <button
                  onClick={() => handleToggleStatus(p.id, p.status)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors min-h-[36px] ${
                    p.status === "published"
                      ? "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/25 hover:bg-[var(--success)]/20"
                      : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/25 hover:bg-zinc-500/20"
                  }`}
                  title="Klik untuk ubah status publikasi"
                >
                  {p.status === "published" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Published</span>
                    </>
                  ) : (
                    <span>Draft</span>
                  )}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(p)}
                  className="p-2 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] min-h-[36px] flex items-center justify-center transition-colors"
                  title="Edit Proyek"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Preview Button */}
                <Link
                  href={`/en/work/${p.slug}`}
                  target="_blank"
                  className="p-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] min-h-[36px] flex items-center justify-center transition-colors"
                  title="Pratinjau Halaman Publik"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(p.id, p.title.en)}
                  className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 min-h-[36px] flex items-center justify-center transition-colors"
                  title="Hapus Proyek"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Step-by-Step Editor Modal */}
      {isEditorOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="font-bold text-base text-[var(--text)]">
                  {editingProject.title.en ? `Edit: ${editingProject.title.en}` : "Tambah Proyek Baru"}
                </h2>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tab Headers */}
            <div className="flex border-b border-[var(--border)] bg-[var(--background)]/50 px-5 shrink-0 overflow-x-auto">
              {[
                { id: "basic", label: "1. Info Dasar & Cover" },
                { id: "tldr", label: "2. TL;DR & Metrik" },
                { id: "review", label: "3. Review & Publikasi" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditorTab(tab.id as typeof activeEditorTab)}
                  className={`py-3 px-3.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                    activeEditorTab === tab.id
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Error banner */}
            {editorError && (
              <div className="m-5 mb-0 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editorError}</span>
              </div>
            )}

            {/* Modal Body / Tab Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* TAB 1: BASIC INFO */}
              {activeEditorTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1.5 text-[var(--text)]">
                        Judul Proyek (English) *
                      </label>
                      <input
                        type="text"
                        value={editingProject.title.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newSlug = val
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)+/g, "");
                          setEditingProject({
                            ...editingProject,
                            title: { ...editingProject.title, en: val },
                            slug: editingProject.slug || newSlug,
                          });
                        }}
                        placeholder="Contoh: PayPulse Merchant App"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1.5 text-[var(--text)]">
                        Judul Proyek (Indonesian)
                      </label>
                      <input
                        type="text"
                        value={editingProject.title.id}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            title: { ...editingProject.title, id: e.target.value },
                          })
                        }
                        placeholder="Contoh: Aplikasi Merchant PayPulse"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1.5 text-[var(--text)]">
                        Slug URL (unik) *
                      </label>
                      <input
                        type="text"
                        value={editingProject.slug}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                          })
                        }
                        placeholder="paypulse-merchant-app"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1.5 text-[var(--text)]">
                        Kategori Proyek
                      </label>
                      <select
                        value={editingProject.category}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            category: e.target.value as Project["category"],
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                      >
                        <option value="Fintech">Fintech</option>
                        <option value="Admin Tools">Admin Tools</option>
                        <option value="Mobile Apps">Mobile Apps</option>
                        <option value="Design Systems">Design Systems</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold mb-1.5 text-[var(--text)]">
                        Peran Desain
                      </label>
                      <input
                        type="text"
                        value={editingProject.role}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, role: e.target.value })
                        }
                        placeholder="Lead Product Designer"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1.5 text-[var(--text)]">
                        Durasi
                      </label>
                      <input
                        type="text"
                        value={editingProject.duration}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, duration: e.target.value })
                        }
                        placeholder="3 bulan"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1.5 text-[var(--text)]">
                        Struktur Tim
                      </label>
                      <input
                        type="text"
                        value={editingProject.team}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, team: e.target.value })
                        }
                        placeholder="1 PM, 4 Devs, 1 QA"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block font-semibold mb-1.5 text-[var(--text)]">
                      Ringkasan Singkat (Summary EN)
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.summary.en}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          summary: { ...editingProject.summary, en: e.target.value },
                        })
                      }
                      placeholder="One-line value summary of the project..."
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                    />
                  </div>

                  {/* Cover Image & Auto-Compressor */}
                  <div className="space-y-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold text-[var(--text)]">
                        Cover Image Proyek (Rasio 16:9)
                      </label>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        Otomatis WebP & Dimensi 1920x1080
                      </span>
                    </div>

                    {/* Integrated Dropzone */}
                    <ImageUploadDropzone
                      label="Upload & Kompres Cover Proyek ke Supabase"
                      preset="cover"
                      bucket="portfolio-assets"
                      folder="projects"
                      onUploadComplete={(publicUrl) => {
                        setEditingProject((prev) =>
                          prev ? { ...prev, coverUrl: publicUrl } : null
                        );
                      }}
                    />

                    {/* Preview and Manual Link */}
                    {editingProject.coverUrl && (
                      <div className="pt-2 flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editingProject.coverUrl}
                          alt="Preview cover"
                          className="w-24 h-14 object-cover rounded-xl border border-[var(--border)] bg-zinc-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-semibold text-[var(--text-muted)] block mb-1">
                            URL Gambar Aktif (Bisa diedit manual):
                          </span>
                          <input
                            type="text"
                            value={editingProject.coverUrl}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, coverUrl: e.target.value })
                            }
                            placeholder="https://..."
                            className="w-full px-2.5 py-1.5 text-[11px] font-mono rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: TL;DR & METRICS */}
              {activeEditorTab === "tldr" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-3">
                    <span className="font-bold text-[var(--text)] block">
                      Metrik Dampak Utama (Metric)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-[var(--text-muted)]">
                          Nilai Metrik (contoh: +34% atau 2.4x)
                        </label>
                        <input
                          type="text"
                          value={editingProject.metrics[0]?.value || ""}
                          onChange={(e) => {
                            const newMetrics = [...editingProject.metrics];
                            newMetrics[0] = {
                              value: e.target.value,
                              label: newMetrics[0]?.label || { en: "Conversion", id: "Konversi" },
                            };
                            setEditingProject({ ...editingProject, metrics: newMetrics });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1 text-[var(--text-muted)]">
                          Label Metrik (EN)
                        </label>
                        <input
                          type="text"
                          value={editingProject.metrics[0]?.label.en || ""}
                          onChange={(e) => {
                            const newMetrics = [...editingProject.metrics];
                            newMetrics[0] = {
                              value: newMetrics[0]?.value || "+0%",
                              label: {
                                ...newMetrics[0]?.label,
                                en: e.target.value,
                                id: newMetrics[0]?.label?.id || e.target.value,
                              },
                            };
                            setEditingProject({ ...editingProject, metrics: newMetrics });
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Problem */}
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--text)]">
                      Problem (Masalah Pengguna EN)
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.tldr.problem.en}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          tldr: {
                            ...editingProject.tldr,
                            problem: { ...editingProject.tldr.problem, en: e.target.value },
                          },
                        })
                      }
                      placeholder="What was the user problem?"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                    />
                  </div>

                  {/* Solution */}
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--text)]">
                      Solution (Solusi Desain EN)
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.tldr.solution.en}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          tldr: {
                            ...editingProject.tldr,
                            solution: { ...editingProject.tldr.solution, en: e.target.value },
                          },
                        })
                      }
                      placeholder="What was the UX solution?"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                    />
                  </div>

                  {/* Impact */}
                  <div>
                    <label className="block font-semibold mb-1 text-[var(--text)]">
                      Impact (Hasil & Dampak EN)
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.tldr.impact.en}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          tldr: {
                            ...editingProject.tldr,
                            impact: { ...editingProject.tldr.impact, en: e.target.value },
                          },
                        })
                      }
                      placeholder="What measurable impact was achieved?"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: REVIEW & PUBLISH */}
              {activeEditorTab === "review" && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--text)] block">
                          Tandai Sebagai Sample Project
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          Wajib dicentang jika ini adalah data demo/fiktif per aturan AGENTS.md §10.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editingProject.isSampleProject}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            isSampleProject: e.target.checked,
                          })
                        }
                        className="w-5 h-5 accent-[var(--accent)] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                      <div>
                        <span className="font-bold text-[var(--text)] block">
                          Status Publikasi
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          Published agar muncul di portofolio publik, atau Draft untuk draf internal.
                        </span>
                      </div>
                      <select
                        value={editingProject.status}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            status: e.target.value as PublishStatus,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-semibold"
                      >
                        <option value="draft">Draft (Draf)</option>
                        <option value="published">Published (Terbit)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                    <span className="font-bold text-xs text-[var(--success)] flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4" />
                      Checklist Kesiapan:
                    </span>
                    <ul className="space-y-1 text-[11px] text-[var(--text-muted)] list-disc pl-5">
                      <li>Judul & Slug lengkap</li>
                      <li>Cover image terisi</li>
                      <li>Metrik dan TL;DR terisi</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--background)]/80 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--text)]"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveProject}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold text-xs flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Layers,
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { Experience } from "@/domain/entities/Experience";
import { Service } from "@/domain/entities/Service";
import { ImageUploadDropzone } from "./ImageUploadDropzone";

interface ExperienceManagerProps {
  initialExperiences: Experience[];
  initialServices: Service[];
}

export const ExperienceManager: React.FC<ExperienceManagerProps> = ({
  initialExperiences,
  initialServices,
}) => {
  const [activeTab, setActiveTab] = useState<"experiences" | "services">("experiences");
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [services, setServices] = useState<Service[]>(initialServices);

  // Experience modal state
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isSavingExp, setIsSavingExp] = useState(false);

  // Service modal state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isSavingService, setIsSavingService] = useState(false);

  // Handlers for Experience
  const handleOpenNewExp = () => {
    const emptyExp: Experience = {
      id: `exp-${Date.now()}`,
      company: "",
      logoUrl: "",
      role: { en: "", id: "" },
      period: { en: "2024 — Present", id: "2024 — Sekarang" },
      location: "Jakarta / Remote",
      bullets: [
        {
          action: { en: "Led product design", id: "Memimpin desain produk" },
          context: { en: "for fintech platform", id: "untuk platform fintech" },
          result: { en: "increasing retention by 15%", id: "meningkatkan retensi 15%" },
          fullText: {
            en: "Led product design for fintech platform, increasing retention by 15%.",
            id: "Memimpin desain produk untuk platform fintech, meningkatkan retensi 15%.",
          },
        },
      ],
      skillsUsed: ["Figma", "Design Systems"],
      order: experiences.length + 1,
    };
    setEditingExp(emptyExp);
    setIsExpModalOpen(true);
  };

  const handleEditExp = (exp: Experience) => {
    setEditingExp({ ...exp });
    setIsExpModalOpen(true);
  };

  const handleDeleteExp = async (id: string, company: string) => {
    if (!window.confirm(`Hapus pengalaman kerja di "${company}"?`)) return;
    try {
      const res = await fetch(`/api/admin/experience?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setExperiences((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveExp = async () => {
    if (!editingExp || !editingExp.company.trim()) return;
    setIsSavingExp(true);
    try {
      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExp),
      });
      if (res.ok) {
        setExperiences((prev) => {
          const exists = prev.some((e) => e.id === editingExp.id);
          if (exists) {
            return prev.map((e) => (e.id === editingExp.id ? editingExp : e));
          }
          return [editingExp, ...prev];
        });
        setIsExpModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingExp(false);
    }
  };

  // Handlers for Services
  const handleOpenNewService = () => {
    const emptyService: Service = {
      id: `srv-${Date.now()}`,
      slug: "",
      title: { en: "", id: "" },
      summary: { en: "", id: "" },
      targetAudience: { en: "Early-stage startups", id: "Startup tahap awal" },
      deliverables: [{ en: "Complete Figma source files", id: "File sumber Figma lengkap" }],
      processSteps: [],
      order: services.length + 1,
      status: "available",
    };
    setEditingService(emptyService);
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsServiceModalOpen(true);
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!window.confirm(`Hapus layanan "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveService = async () => {
    if (!editingService || !editingService.title.en.trim()) return;
    setIsSavingService(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });
      if (res.ok) {
        setServices((prev) => {
          const exists = prev.some((s) => s.id === editingService.id);
          if (exists) {
            return prev.map((s) => (s.id === editingService.id ? editingService : s));
          }
          return [...prev, editingService];
        });
        setIsServiceModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingService(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Pengalaman & Layanan Freelance
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Kelola timeline karir profesional dan penawaran paket layanan freelance.
          </p>
        </div>

        {activeTab === "experiences" ? (
          <button
            onClick={handleOpenNewExp}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengalaman Kerja</span>
          </button>
        ) : (
          <button
            onClick={handleOpenNewService}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Layanan Baru</span>
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab("experiences")}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "experiences"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Riwayat Pengalaman ({experiences.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "services"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Layanan Freelance ({services.length})</span>
        </button>
      </div>

      {/* TAB 1: EXPERIENCES LIST */}
      {activeTab === "experiences" && (
        <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
          {experiences.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              Belum ada data pengalaman kerja.
            </div>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-hover)]/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {exp.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={exp.logoUrl}
                      alt={exp.company}
                      className="w-12 h-12 object-contain p-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] flex items-center justify-center font-bold text-xs text-[var(--accent)] shrink-0">
                      {exp.company ? exp.company.slice(0, 2).toUpperCase() : "CO"}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-sm text-[var(--text)]">
                        {exp.company}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
                        {exp.role.en}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {exp.period.en} &bull; {exp.location}
                    </p>
                    <p className="text-xs text-[var(--text)] mt-1.5 italic">
                      &ldquo;{exp.bullets[0]?.fullText.en || exp.bullets[0]?.action.en}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEditExp(exp)}
                    className="p-2 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)]"
                    title="Edit Pengalaman"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExp(exp.id, exp.company)}
                    className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: SERVICES LIST */}
      {activeTab === "services" && (
        <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
          {services.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              Belum ada data layanan freelance.
            </div>
          ) : (
            services.map((srv) => (
              <div
                key={srv.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-hover)]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[var(--text)]">
                      {srv.title.en}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        srv.status === "available"
                          ? "bg-[var(--success)]/10 text-[var(--success)]"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {srv.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {srv.summary.en}
                  </p>
                  <div className="text-[11px] text-[var(--text-muted)] mt-1">
                    Audience: <span className="text-[var(--text)] font-semibold">{srv.targetAudience.en}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEditService(srv)}
                    className="p-2 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)]"
                    title="Edit Layanan"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(srv.id, srv.title.en)}
                    className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Experience Modal */}
      {isExpModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h2 className="font-bold text-base text-[var(--text)]">
                {editingExp.company ? `Edit: ${editingExp.company}` : "Tambah Pengalaman Kerja"}
              </h2>
              <button
                onClick={() => setIsExpModalOpen(false)}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  value={editingExp.company}
                  onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                  placeholder="Contoh: Tokopedia, Gojek, PayPulse"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                />
              </div>

              {/* Logo Perusahaan Dropzone & Preview */}
              <div className="space-y-2 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <label className="block font-semibold text-[var(--text)]">
                  Logo Perusahaan (Rasio 1:1)
                </label>
                <ImageUploadDropzone
                  label="Upload & Kompres Logo Perusahaan ke Supabase"
                  preset="avatar"
                  bucket="portfolio-assets"
                  folder="companies"
                  onUploadComplete={(publicUrl) => {
                    setEditingExp((prev) => (prev ? { ...prev, logoUrl: publicUrl } : null));
                  }}
                />

                {editingExp.logoUrl && (
                  <div className="pt-1.5 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editingExp.logoUrl}
                      alt="Preview logo"
                      className="w-10 h-10 object-contain p-1 rounded-xl border border-[var(--border)] bg-zinc-800/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-[var(--text-muted)] block mb-0.5">
                        URL Logo Aktif (Bisa diedit manual):
                      </span>
                      <input
                        type="text"
                        value={editingExp.logoUrl}
                        onChange={(e) =>
                          setEditingExp({ ...editingExp, logoUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 text-[11px] font-mono rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Role (English)
                  </label>
                  <input
                    type="text"
                    value={editingExp.role.en}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        role: { ...editingExp.role, en: e.target.value },
                      })
                    }
                    placeholder="Senior Product Designer"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Periode Waktu
                  </label>
                  <input
                    type="text"
                    value={editingExp.period.en}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        period: { ...editingExp.period, en: e.target.value },
                      })
                    }
                    placeholder="2022 — 2024"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Pencapaian Utama (Impact Bullet Point EN)
                </label>
                <textarea
                  rows={3}
                  value={editingExp.bullets[0]?.fullText.en || ""}
                  onChange={(e) => {
                    const newBullets = [...editingExp.bullets];
                    newBullets[0] = {
                      action: { en: e.target.value, id: e.target.value },
                      context: { en: "", id: "" },
                      result: { en: "", id: "" },
                      fullText: { en: e.target.value, id: e.target.value },
                    };
                    setEditingExp({ ...editingExp, bullets: newBullets });
                  }}
                  placeholder="Led design system unification reducing UI build time by 40%..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => setIsExpModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveExp}
                disabled={isSavingExp}
                className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs flex items-center gap-1.5"
              >
                {isSavingExp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h2 className="font-bold text-base text-[var(--text)]">
                {editingService.title.en ? `Edit: ${editingService.title.en}` : "Tambah Layanan Baru"}
              </h2>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Nama Layanan (English) *
                </label>
                <input
                  type="text"
                  value={editingService.title.en}
                  onChange={(e) => {
                    const val = e.target.value;
                    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    setEditingService({
                      ...editingService,
                      title: { ...editingService.title, en: val },
                      slug: editingService.slug || slug,
                    });
                  }}
                  placeholder="Design Sprint & Rapid Prototyping"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Deskripsi / Ringkasan Layanan
                </label>
                <textarea
                  rows={2}
                  value={editingService.summary.en}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      summary: { ...editingService.summary, en: e.target.value },
                    })
                  }
                  placeholder="Brief summary of what this service solves..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Target Audiens
                  </label>
                  <input
                    type="text"
                    value={editingService.targetAudience.en}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        targetAudience: { ...editingService.targetAudience, en: e.target.value },
                      })
                    }
                    placeholder="Startups, B2B SaaS"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Status Layanan
                  </label>
                  <select
                    value={editingService.status}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        status: e.target.value as Service["status"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  >
                    <option value="available">Available (Tersedia)</option>
                    <option value="limited">Limited (Terbatas)</option>
                    <option value="booked">Booked (Penuh)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveService}
                disabled={isSavingService}
                className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs flex items-center gap-1.5"
              >
                {isSavingService ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

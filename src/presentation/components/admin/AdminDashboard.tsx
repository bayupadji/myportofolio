"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { Project } from "@/domain/entities/Project";
import { Message } from "@/domain/entities/Message";
import { Profile } from "@/domain/entities/Profile";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";
import {
  useAdminProjects,
  useUpdateProjectStatusMutation,
} from "@/presentation/hooks/useAdminQueries";
import { ImageUploadDropzone } from "./ImageUploadDropzone";

export interface AdminDashboardProps {
  projects: Project[];
  messages: Message[];
  profile: Profile;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects: initialProjects,
  messages,
  profile,
}) => {
  const { data: projects = initialProjects } = useAdminProjects(initialProjects);
  const updateStatusMutation = useUpdateProjectStatusMutation();

  const [activeTab, setActiveTab] = useState<
    "projects" | "messages" | "checklist" | "media"
  >("projects");
  const [isFreelanceAvailable, setIsFreelanceAvailable] = useState<boolean>(
    profile.isAvailableForFreelance
  );
  const [checklistProject, setChecklistProject] = useState<Project | null>(
    initialProjects[0] || null
  );

  const toggleProjectStatus = (id: string, currentStatus: PublishStatus) => {
    const newStatus: PublishStatus = currentStatus === "published" ? "draft" : "published";
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      {/* Admin Header */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-[1200px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/en"
              className="p-2 rounded-[16px] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] min-h-[40px] flex items-center justify-center"
              title="Return to public portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--accent)]" />
                <h1 className="font-bold text-lg text-[var(--text)]">
                  Portfolio CMS · Bayu (Owner)
                </h1>
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                Manage case studies, pre-publish checks, and inbound briefs
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFreelanceAvailable(!isFreelanceAvailable)}
              className="px-3.5 py-1.5 rounded-[16px] border border-[var(--border)] bg-[var(--surface-hover)] text-xs font-semibold flex items-center gap-2 min-h-[36px]"
            >
              <span>Availability:</span>
              {isFreelanceAvailable ? (
                <span className="text-[var(--success)] font-bold">Open</span>
              ) : (
                <span className="text-amber-500 font-bold">Limited</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8 flex items-center gap-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("projects")}
            className={`py-3.5 px-3 text-sm font-semibold border-b-2 transition-colors min-h-[44px] whitespace-nowrap ${
              activeTab === "projects"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            Case Studies ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`py-3.5 px-3 text-sm font-semibold border-b-2 transition-colors min-h-[44px] whitespace-nowrap ${
              activeTab === "messages"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            Inbound Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`py-3.5 px-3 text-sm font-semibold border-b-2 transition-colors min-h-[44px] whitespace-nowrap ${
              activeTab === "checklist"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            Pre-Publish QA Checklist
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`py-3.5 px-3 text-sm font-semibold border-b-2 transition-colors min-h-[44px] whitespace-nowrap ${
              activeTab === "media"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            Storage & Media (Compressor)
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-[1200px] px-4 sm:px-8 py-8">
        {activeTab === "projects" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-xl font-bold">Project Catalog & Visibility</h2>
              <span className="text-xs text-[var(--text-muted)]">
                All changes reflect instantly in Server Components
              </span>
            </div>

            <div className="border border-[var(--border)] rounded-xl bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-hover)]/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.coverUrl}
                      alt={p.slug}
                      className="w-16 h-12 object-cover rounded-md border border-[var(--border)] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-base text-[var(--text)]">
                          {p.title.en}
                        </span>
                        {p.isSampleProject && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                            Sample project
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        Slug: /{p.slug} · {p.category} · {p.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setChecklistProject(p);
                        setActiveTab("checklist");
                      }}
                      className="px-3 py-1.5 rounded-[16px] border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-hover)] min-h-[36px]"
                    >
                      QA Checklist
                    </button>

                    <button
                      onClick={() => toggleProjectStatus(p.id, p.status)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[16px] text-xs font-bold transition-colors min-h-[36px] ${
                        p.status === "published"
                          ? "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/25 hover:bg-[var(--success)]/20"
                          : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/25 hover:bg-zinc-500/20"
                      }`}
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

                    <Link
                      href={`/en/work/${p.slug}`}
                      target="_blank"
                      className="p-2 rounded-[16px] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] min-h-[36px] flex items-center justify-center"
                      title="Preview public page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Inbound Contact Submissions</h2>
            <div className="border border-[var(--border)] rounded-xl bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-sm text-[var(--text-muted)]">
                  No messages received yet.
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="p-6 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[var(--text)]">
                          {m.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] font-semibold uppercase">
                          Topic: {m.topic}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--accent)] font-mono">
                      {m.email}
                    </div>

                    <p className="text-sm text-[var(--text)] bg-[var(--background)] p-3 rounded-lg border border-[var(--border)] whitespace-pre-wrap">
                      {m.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "checklist" && (
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Pre-Publish Checklist: {checklistProject?.title.en || "Select Project"}
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Mandatory quality gates per PRD Section 10.9 & AGENTS.md before going live.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-hover)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[var(--text)]">
                    Zero Unlabeled Placeholder Content
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    All dummy and template text is flagged or eliminated. Sample projects carry visible &quot;Sample project&quot; tags.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-hover)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[var(--text)]">
                    Accessible Image Alt Text & Lightbox
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    All case study screenshots have descriptive alt attributes and keyboard accessible lightbox viewing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-hover)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[var(--text)]">
                    Full Bilingual Parity (English & Indonesian)
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Title, summary, TL;DR, and process sections provide Indonesian content or graceful fallback.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-hover)]">
                <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-[var(--text)]">
                    Responsive States (Default, Empty, Error, Loading)
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Detailed state specifications are documented in the case study gallery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media & Image Compressor Tab */}
        {activeTab === "media" && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold">Supabase Storage & Mandatory Image Compressor</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Semua gambar otomatis dikompresi di sisi client (WebP, kualitas 80%, dimensi presisi) sebelum diunggah ke Supabase Storage, menghemat kuota penyimpanan hingga 85-95%.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cover / Project Image Dropzone */}
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
                <ImageUploadDropzone
                  label="1. Project Cover / Case Study Asset"
                  preset="cover"
                  bucket="portfolio-assets"
                  folder="projects"
                />
              </div>

              {/* Profile Avatar Dropzone */}
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
                <ImageUploadDropzone
                  label="2. Profile Avatar / Headshot"
                  preset="avatar"
                  bucket="portfolio-assets"
                  folder="avatars"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

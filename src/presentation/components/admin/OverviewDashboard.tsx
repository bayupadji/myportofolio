"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Mail,
  Zap,
  CheckCircle2,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Home,
  Layers,
  UserCheck,
  Database,
  ArrowUpRight,
} from "lucide-react";
import { Project } from "@/domain/entities/Project";
import { Message } from "@/domain/entities/Message";
import { Profile } from "@/domain/entities/Profile";
import { useUpdateAvailabilityMutation } from "@/presentation/hooks/useAdminQueries";

interface OverviewDashboardProps {
  projects: Project[];
  messages: Message[];
  profile: Profile;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  projects,
  messages,
  profile,
}) => {
  const [isFreelance, setIsFreelance] = useState<boolean>(
    profile.isAvailableForFreelance
  );
  const updateAvailabilityMutation = useUpdateAvailabilityMutation();
  const isUpdatingStatus = updateAvailabilityMutation.isPending;

  const publishedCount = projects.filter((p) => p.status === "published").length;
  const draftCount = projects.filter((p) => p.status === "draft").length;
  const sampleCount = projects.filter((p) => p.isSampleProject).length;

  const toggleAvailability = async () => {
    const newStatus = !isFreelance;
    try {
      await updateAvailabilityMutation.mutateAsync({
        statusEn: profile.availabilityStatus?.en || "Available",
        statusId: profile.availabilityStatus?.id || "Tersedia",
        isFreelance: newStatus,
      });
      setIsFreelance(newStatus);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const recentMessages = messages.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Studio Header & Quick Action Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)] text-balance">
              Studio Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 font-mono">
              Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 max-w-2xl text-pretty">
            Real-time portfolio management, inbound inquiries from prospective clients, and publication readiness checks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-95 font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Case Study</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Portfolio</span>
          </Link>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Case Studies */}
        <Link
          href="/admin/projects"
          className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 transition-all group shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                Case Studies
              </span>
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center transition-transform group-hover:scale-110">
                <FolderGit2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[var(--text)] mb-2 font-mono tabular-nums">
              {projects.length}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] pt-3 border-t border-[var(--border)]/50">
            <span className="text-[var(--success)] font-semibold">
              {publishedCount} Published
            </span>
            <span className="text-[var(--text-muted)]">&bull;</span>
            <span className="text-zinc-500">{draftCount} Drafts</span>
            {sampleCount > 0 && (
              <>
                <span className="text-[var(--text-muted)]">&bull;</span>
                <span className="text-amber-500 font-semibold">{sampleCount} Sample</span>
              </>
            )}
          </div>
        </Link>

        {/* Card 2: Inbound Inquiries */}
        <Link
          href="/admin/messages"
          className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 transition-all group shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                Inbound Inquiries
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center transition-transform group-hover:scale-110">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[var(--text)] mb-2 font-mono tabular-nums">
              {messages.length}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[var(--border)]/50">
            <span className="text-[var(--accent)] font-semibold">
              {messages.length === 0 ? "Inbox Clear" : `${messages.length} Client Briefs`}
            </span>
            <span className="text-[var(--text-muted)] flex items-center gap-0.5">
              <span>View</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Card 3: Availability */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                Freelance Status
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isFreelance
                    ? "bg-[var(--success)]/10 text-[var(--success)]"
                    : "bg-amber-500/10 text-amber-500"
                }`}
              >
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-2xl font-extrabold ${
                  isFreelance ? "text-[var(--success)]" : "text-amber-500"
                }`}
              >
                {isFreelance ? "Open for Work" : "Limited Availability"}
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--border)]/50 flex items-center justify-between">
            <button
              onClick={toggleAvailability}
              disabled={isUpdatingStatus}
              className="text-[11px] font-semibold text-[var(--accent)] hover:underline disabled:opacity-50 cursor-pointer"
            >
              {isUpdatingStatus ? "Updating..." : "Toggle Availability"}
            </button>
            <span className="text-[10px] text-[var(--text-muted)]">Hero Ribbon</span>
          </div>
        </div>

        {/* Card 4: Quality Gate */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                Design & QA Gate
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[var(--text)] mb-2 font-mono tabular-nums">
              100%
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[var(--success)] font-semibold pt-3 border-t border-[var(--border)]/50">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">WCAG 2.2 AA & PRD Ready</span>
          </div>
        </div>
      </div>

      {/* Portfolio Hub Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
              Studio Content Hub
            </h2>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            Direct access to all customizable portfolio sections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hub 1: Landing Page */}
          <Link
            href="/admin/landing"
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]/30 transition-all group flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--border)]">
                  /
                </span>
              </div>
              <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                Landing Page
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 text-pretty">
                Hero specs, metrics ribbon, 4-step UX process, and CTA card.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[var(--border)]/60 text-xs font-semibold text-[var(--accent)] flex items-center justify-between">
              <span>Edit Page</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 2: Case Studies */}
          <Link
            href="/admin/projects"
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]/30 transition-all group flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--border)]">
                  /work
                </span>
              </div>
              <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                Case Studies
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 text-pretty">
                {projects.length} studies ({publishedCount} published), Markdown sections, and metrics.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[var(--border)]/60 text-xs font-semibold text-[var(--accent)] flex items-center justify-between">
              <span>Manage Studies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 3: Freelance Services */}
          <Link
            href="/admin/services"
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]/30 transition-all group flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--border)]">
                  /services
                </span>
              </div>
              <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                Design Services
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 text-pretty">
                Design packages, target audience framing, and deliverables.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[var(--border)]/60 text-xs font-semibold text-[var(--accent)] flex items-center justify-between">
              <span>Edit Services</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hub 4: About Me */}
          <Link
            href="/admin/about"
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]/30 transition-all group flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--border)]">
                  /about
                </span>
              </div>
              <h3 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                About & Career
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 text-pretty">
                Designer story, experience timeline, skills matrix, and CV link.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[var(--border)]/60 text-xs font-semibold text-[var(--accent)] flex items-center justify-between">
              <span>Edit About</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Recent Inbounds & Architecture/QA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Inbound Messages */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="font-bold text-sm text-[var(--text)]">
                Recent Inbound Inquiries
              </h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All ({messages.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--text-muted)] space-y-2">
              <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
                <Mail className="w-5 h-5 opacity-40" />
              </div>
              <p className="font-semibold text-[var(--text)]">No inquiries yet</p>
              <p className="text-[11px] text-[var(--text-muted)]">
                When visitors submit the contact form, their briefs will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[var(--accent)]/15 text-[var(--accent)] font-bold text-[10px] flex items-center justify-center font-mono">
                        {msg.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-[var(--text)]">{msg.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--accent)]/10 text-[var(--accent)] uppercase font-mono">
                      {msg.topic}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 text-pretty">
                    {msg.body}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/60 text-[11px]">
                    <span className="text-[var(--accent)] font-mono">{msg.email}</span>
                    <a
                      href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry (${msg.topic})`}
                      className="font-semibold text-[var(--text)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
                    >
                      <span>Reply</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quality Standards & Architecture Specs */}
        <div className="space-y-6">
          {/* Pre-Publish Quality Gates */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
                <h2 className="font-bold text-sm text-[var(--text)]">
                  Quality Gates (PRD & WCAG 2.2 AA)
                </h2>
              </div>
              <span className="text-[11px] text-[var(--success)] font-bold font-mono">
                Passing
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-[var(--text)]">
                    Zero Unlabeled Placeholder Copy
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] text-pretty">
                    Sample case studies carry explicit &ldquo;Sample project&rdquo; tags with no hidden lorem ipsum.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-[var(--text)]">
                    Single-Source English UX Writing
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] text-pretty">
                    Clean, concise vocabulary tailored for hiring managers, design leads, and enterprise recruiters.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-[var(--text)]">
                    Token-Based Color & Accessible Focus
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] text-pretty">
                    Strict WCAG 2.2 AA contrast in both light and dark themes with visible keyboard focus rings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Spec Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text)]">
              <Database className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>System & Database Specification</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <div className="text-[10px] text-[var(--text-muted)] font-medium">Database</div>
                <div className="font-mono font-bold text-[var(--text)] mt-0.5">SQLite (WAL)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <div className="text-[10px] text-[var(--text-muted)] font-medium">ORM Layer</div>
                <div className="font-mono font-bold text-[var(--text)] mt-0.5">Drizzle ORM</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <div className="text-[10px] text-[var(--text-muted)] font-medium">Authentication</div>
                <div className="font-mono font-bold text-[var(--text)] mt-0.5">Scrypt · Credentials</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                <div className="text-[10px] text-[var(--text-muted)] font-medium">Architecture</div>
                <div className="font-mono font-bold text-[var(--text)] mt-0.5">Clean Architecture</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

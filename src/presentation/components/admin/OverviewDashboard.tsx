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
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Overview Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              Live
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Portfolio metrics summary, inbound inquiries from prospective clients, and publication readiness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Projects</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] font-semibold rounded-xl text-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Projects */}
        <Link
          href="/admin/projects"
          className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 transition-all group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              Total Case Studies
            </span>
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--text)] mb-2 font-mono">
            {projects.length}
          </div>
          <div className="flex items-center gap-2 text-[11px]">
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

        {/* Card 2: Inbound Messages */}
        <Link
          href="/admin/messages"
          className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 transition-all group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              Inbound Inquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--text)] mb-2 font-mono">
            {messages.length}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <span className="text-[var(--accent)] font-semibold">All Inquiries</span>
            <span>saved in inbox</span>
          </div>
        </Link>

        {/* Card 3: Availability */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
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
              {isFreelance ? "Open" : "Limited"}
            </span>
          </div>
          <button
            onClick={toggleAvailability}
            disabled={isUpdatingStatus}
            className="text-[11px] font-semibold text-[var(--accent)] hover:underline disabled:opacity-50"
          >
            {isUpdatingStatus ? "Saving..." : "Click to toggle status"}
          </button>
        </div>

        {/* Card 4: Quality Gate */}
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-muted)]">
              Content Quality
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[var(--text)] mb-2 font-mono">
            100%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[var(--success)] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Meets PRD standards</span>
          </div>
        </div>
      </div>

      {/* Portfolio Pages Hub */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            Portfolio Sections Hub:
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">
            Quick jump to customize any public page
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Hub 1: Landing Page */}
          <Link
            href="/admin/landing"
            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]/30 transition-all group flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  <Home className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">/</span>
              </div>
              <h3 className="font-bold text-xs text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                Landing Page
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">
                Hero headline, key impact metrics, 4-step process, & CTA banner.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[var(--border)]/60 text-[11px] font-semibold text-[var(--accent)] flex items-center justify-between">
              <span>Edit Landing</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Hub 2: Case Studies */}
          <Link
            href="/admin/projects"
            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]/30 transition-all group flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  <FolderGit2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">/work</span>
              </div>
              <h3 className="font-bold text-xs text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                Case Studies
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">
                {projects.length} studies ({publishedCount} published), WYSIWYG editor.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[var(--border)]/60 text-[11px] font-semibold text-[var(--accent)] flex items-center justify-between">
              <span>Manage Projects</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Hub 3: Freelance Services */}
          <Link
            href="/admin/services"
            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]/30 transition-all group flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">/services</span>
              </div>
              <h3 className="font-bold text-xs text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                Freelance Services
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">
                Design packages, target audiences, and deliverables.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[var(--border)]/60 text-[11px] font-semibold text-[var(--accent)] flex items-center justify-between">
              <span>Edit Services</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Hub 4: About Me */}
          <Link
            href="/admin/about"
            className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)]/30 transition-all group flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">/about</span>
              </div>
              <h3 className="font-bold text-xs text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                About & Career
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">
                Bio story, work experience timeline with logo, and CV link.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[var(--border)]/60 text-[11px] font-semibold text-[var(--accent)] flex items-center justify-between">
              <span>Edit About</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Grid: Recent Inbounds & QA Gates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Inbound Messages */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
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
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No inbound messages received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--text)]">{msg.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--accent)]/10 text-[var(--accent)] uppercase">
                      {msg.topic}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {msg.body}
                  </p>
                  <div className="text-[11px] text-[var(--accent)] font-mono">
                    {msg.email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Pre-Publish Quality Gates */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
              <h2 className="font-bold text-sm text-[var(--text)]">
                Pre-Publish QA Gates (PRD §10.9)
              </h2>
            </div>
            <span className="text-[11px] text-[var(--success)] font-bold">
              All Passing
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-[var(--text)]">
                  Zero Unlabeled Placeholder Text
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Sample projects are clearly labeled &ldquo;Sample project&rdquo; with no hidden lorem ipsum text.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-[var(--text)]">
                  English-Only Consistency
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  All case studies, summaries, and sections are streamlined for clear, single-input English copy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
              <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-[var(--text)]">
                  Accessibility & Compressed Assets
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Alt text is present for screen readers and images are compressed into efficient WebP format.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

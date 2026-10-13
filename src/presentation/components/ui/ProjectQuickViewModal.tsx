"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ArrowUpRight, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { Project } from "@/domain/entities/Project";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { Tag } from "./Tag";
import { CountUp } from "../motion/CountUp";

export interface ProjectQuickViewModalProps {
  project: Project | null;
  locale?: Locale;
  messages: Messages;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectQuickViewModal: React.FC<ProjectQuickViewModalProps> = ({
  project,
  locale,
  messages,
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const title = resolveLocalized(project.title, locale).text;
  const summary = resolveLocalized(project.summary, locale).text;
  const problem = resolveLocalized(project.tldr.problem, locale).text;
  const solution = resolveLocalized(project.tldr.solution, locale).text;
  const impact = resolveLocalized(project.tldr.impact, locale).text;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header / Media Banner */}
        <div className="relative aspect-21/9 w-full bg-[var(--surface-hover)] overflow-hidden border-b border-[var(--border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-80" />

          {/* Close button (44x44px target) */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={messages.work.closeQuickView}
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-[16px] bg-black/60 text-white backdrop-blur-md border border-white/20 hover:bg-black/80 transition-colors focus-visible:outline-2"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs">
              {project.category}
            </span>
            {project.isSampleProject && (
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-amber-500 text-white shadow-xs">
                {messages.work.sampleProjectBadge}
              </span>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Meta & Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {project.platforms.map((p) => (
                <Tag key={p} size="sm">
                  {p}
                </Tag>
              ))}
              <span className="text-xs text-[var(--text-muted)]">
                · {project.duration} · {project.role.split("(")[0]}
              </span>
            </div>

            <h2
              id="quick-view-title"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)] mb-3"
            >
              {title}
            </h2>
            <p className="text-base text-[var(--text-muted)] leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Key Metrics Strip */}
          {project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {project.metrics.map((m, idx) => {
                const labelText = resolveLocalized(m.label, locale).text;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col"
                  >
                    <span className="text-2xl font-black text-[var(--accent)] tracking-tight">
                      <CountUp value={m.value} />
                    </span>
                    <span className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                      {labelText}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* TL;DR Highlight Cards */}
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/60">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{messages.work.tldrProblem}</span>
              </div>
              <div
                className="text-sm text-[var(--text)] leading-relaxed [&_strong]:font-bold [&_strong]:text-[var(--text)]"
                dangerouslySetInnerHTML={{ __html: problem }}
              />
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/60">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{messages.work.tldrSolution}</span>
              </div>
              <div
                className="text-sm text-[var(--text)] leading-relaxed [&_strong]:font-bold [&_strong]:text-[var(--text)]"
                dangerouslySetInnerHTML={{ __html: solution }}
              />
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/60">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>{messages.work.tldrImpact}</span>
              </div>
              <div
                className="text-sm text-[var(--text)] leading-relaxed [&_strong]:font-bold [&_strong]:text-[var(--text)]"
                dangerouslySetInnerHTML={{ __html: impact }}
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-[16px] border border-[var(--border)] text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors min-h-[44px]"
            >
              {messages.work.closeQuickView}
            </button>

            <Link
              href={`/work/${project.slug}`}
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[16px] bg-[var(--accent)] text-[var(--accent-contrast)] text-sm font-semibold hover:opacity-90 shadow-md shadow-[var(--accent)]/20 transition-all min-h-[44px] active:scale-[0.98]"
            >
              <span>{messages.work.viewFullStudy}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

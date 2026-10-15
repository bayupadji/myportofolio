"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { Project } from "@/domain/entities/Project";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { Tag } from "../ui/Tag";
import { CardSpotlight } from "../ui/CardSpotlight";
import { ProjectQuickViewModal } from "../ui/ProjectQuickViewModal";
import { CountUp } from "../motion/CountUp";

export interface SelectedWorkProps {
  projects: Project[];
  locale?: Locale;
  messages: Messages;
  showAllLink?: boolean;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  projects,
  locale,
  messages,
  showAllLink = true,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [quickViewProject, setQuickViewProject] = useState<Project | null>(null);

  const categories = [
    { id: "All", label: messages.work.filterAll },
    { id: "Fintech", label: messages.work.filterFintech },
    { id: "Admin Tools", label: messages.work.filterAdmin },
    { id: "Mobile Apps", label: messages.work.filterMobile },
    { id: "Design Systems", label: messages.work.filterDesignSystem },
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="case-studies" className="w-full py-16 sm:py-24 border-b border-[var(--border)] scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                {messages.work.badge}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
              {messages.work.title}
            </h2>
            <p className="mt-2 text-base text-[var(--text-muted)] max-w-xl">
              {messages.work.subtitle}
            </p>
          </div>

          {showAllLink && (
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline min-h-[44px]"
            >
              <span>{messages.work.viewAll}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Interactive Filter Pills */}
        <div
          role="tablist"
          aria-label="Filter case studies"
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none"
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count =
              cat.id === "All"
                ? projects.length
                : projects.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(cat.id)}
                className={`group flex items-center gap-2 px-4 py-2 rounded-[16px] text-sm font-medium whitespace-nowrap transition-all duration-150 min-h-[40px] cursor-pointer ${
                  isSelected
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-sm font-semibold"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? "bg-black/20 text-[var(--accent-contrast)]"
                      : "bg-[var(--border-subtle)] text-[var(--text-muted)] group-hover:text-[var(--text)]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project) => {
            const title = resolveLocalized(project.title, locale).text;
            const summary = resolveLocalized(project.summary, locale).text;
            const primaryMetric = project.metrics[0];

            return (
              <CardSpotlight
                key={project.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[var(--accent)] hover:shadow-xl flex flex-col group overflow-hidden"
              >
                {/* Prototype / Application Window Header Bar */}
                <div
                  aria-hidden="true"
                  className="flex items-center justify-between px-3.5 py-2 border-b border-[var(--border)] bg-[var(--surface-hover)]/70 text-[10px] font-mono text-[var(--text-muted)] select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[var(--border)] group-hover:bg-[#FF5F56] transition-colors" />
                    <span className="h-2 w-2 rounded-full bg-[var(--border)] group-hover:bg-[#FFBD2E] transition-colors" />
                    <span className="h-2 w-2 rounded-full bg-[var(--border)] group-hover:bg-[#27C93F] transition-colors" />
                  </div>
                  <div className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]/60 text-[10px] tracking-tight">
                    <span>{project.slug}.design // {project.category.toLowerCase()}</span>
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-[var(--accent)] font-semibold">
                    Case Study
                  </div>
                </div>

                {/* Thumbnail Container */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-[var(--surface-hover)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.coverUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />

                  {/* Overlays / Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-black/70 backdrop-blur-md text-white border border-white/10 shadow-xs">
                      {project.category}
                    </span>
                    {project.isSampleProject && (
                      <span className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-500/90 text-white shadow-xs">
                        {messages.work.sampleProjectBadge}
                      </span>
                    )}
                  </div>

                  {/* Quick View Hover Button */}
                  <button
                    type="button"
                    onClick={() => setQuickViewProject(project)}
                    className="absolute top-3 right-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs font-medium hover:bg-black active:scale-95 shadow-lg border border-white/15 cursor-pointer"
                    aria-label={`${messages.work.quickView} ${title}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{messages.work.quickView}</span>
                  </button>

                  {/* Primary Metric Pill */}
                  {primaryMetric && (
                    <div className="absolute bottom-3 right-3 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] rounded-lg px-3 py-1.5 shadow-md flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] tabular-nums font-mono">
                      <CountUp value={primaryMetric.value} />
                      <span className="text-[var(--text-muted)] font-normal text-[11px] font-sans">
                        {resolveLocalized(primaryMetric.label, locale).text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  {/* Platform & Role tags */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {project.platforms.map((p) => (
                      <Tag key={p} size="sm">
                        {p}
                      </Tag>
                    ))}
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      · {project.role}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)] transition-colors mb-2 text-balance leading-snug">
                    <Link
                      href={`/work/${project.slug}`}
                      className="focus-visible:outline-2 focus-visible:rounded"
                    >
                      {title}
                    </Link>
                  </h3>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 line-clamp-2 text-pretty">
                    {summary}
                  </p>

                  {/* Bottom Action Bar */}
                  <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setQuickViewProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors py-2 px-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{messages.work.quickView}</span>
                    </button>

                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--accent)] group-hover:translate-x-0.5 transition-transform min-h-[44px]"
                    >
                      <span>{messages.work.viewProject}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </CardSpotlight>
            );
          })}
        </div>
      </div>

      {/* Quick View Modal */}
      <ProjectQuickViewModal
        project={quickViewProject}
        locale={locale}
        messages={messages}
        isOpen={Boolean(quickViewProject)}
        onClose={() => setQuickViewProject(null)}
      />
    </section>
  );
};

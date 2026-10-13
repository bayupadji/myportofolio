"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye, Info } from "lucide-react";
import { Project } from "@/domain/entities/Project";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { Tag } from "../ui/Tag";
import { CardSpotlight } from "../ui/CardSpotlight";
import { ProjectQuickViewModal } from "../ui/ProjectQuickViewModal";
import { CountUp } from "../motion/CountUp";

export interface WorkGridProps {
  projects: Project[];
  locale?: Locale;
  messages: Messages;
}

export const WorkGrid: React.FC<WorkGridProps> = ({ projects, locale, messages }) => {
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
    <div className="w-full">
      {/* Sample Project Disclaimer Banner per PRD */}
      <div className="mb-8 p-4 rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <span className="font-semibold">{messages.work.sampleProjectBadge}: </span>
          {messages.work.sampleProjectNotice}
        </div>
      </div>

      {/* Filter Category Chips with Count Badges */}
      <div
        role="tablist"
        aria-label="Filter case studies by category"
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {filteredProjects.map((project) => {
          const title = resolveLocalized(project.title, locale).text;
          const summary = resolveLocalized(project.summary, locale).text;
          const primaryMetric = project.metrics[0];

          return (
            <CardSpotlight
              key={project.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs transition-all duration-300 ease-out hover:-translate-y-2.5 hover:scale-[1.015] hover:border-[var(--accent)] hover:shadow-2xl flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-[var(--surface-hover)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.coverUrl}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {project.category}
                  </span>
                  {project.isSampleProject && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/90 text-white shadow-xs">
                      {messages.work.sampleProjectBadge}
                    </span>
                  )}
                </div>

                {/* Quick View Hover Trigger */}
                <button
                  type="button"
                  onClick={() => setQuickViewProject(project)}
                  className="absolute top-3 right-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[16px] bg-black/75 backdrop-blur-md text-white text-xs font-medium hover:bg-black/90 active:scale-95 shadow-lg border border-white/10 cursor-pointer"
                  aria-label={`${messages.work.quickView} ${title}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{messages.work.quickView}</span>
                </button>

                {primaryMetric && (
                  <div className="absolute bottom-3 right-3 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] rounded-[16px] px-3 py-1.5 shadow-md flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">
                    <CountUp value={primaryMetric.value} />
                    <span className="text-[var(--text-muted)] font-normal text-[11px]">
                      {resolveLocalized(primaryMetric.label, locale).text}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  {project.platforms.map((p) => (
                    <Tag key={p} size="sm">
                      {p}
                    </Tag>
                  ))}
                </div>

                <h3 className="text-xl font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)] transition-colors mb-2">
                  <Link
                    href={`/work/${project.slug}`}
                    className="focus-visible:outline-2 focus-visible:rounded"
                  >
                    {title}
                  </Link>
                </h3>

                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 line-clamp-2">
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
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] group-hover:translate-x-0.5 transition-transform min-h-[44px]"
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

      {/* Quick View Modal */}
      <ProjectQuickViewModal
        project={quickViewProject}
        locale={locale}
        messages={messages}
        isOpen={Boolean(quickViewProject)}
        onClose={() => setQuickViewProject(null)}
      />
    </div>
  );
};

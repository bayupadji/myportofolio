import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/domain/entities/Project";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { Tag } from "../ui/Tag";

export interface SelectedWorkProps {
  projects: Project[];
  locale: Locale;
  messages: Messages;
  showAllLink?: boolean;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  projects,
  locale,
  messages,
  showAllLink = true,
}) => {
  return (
    <section className="w-full py-16 sm:py-24 border-b border-[var(--border)]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
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
              href={`/${locale}/work`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline min-h-[44px]"
            >
              <span>{messages.work.viewAll}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project) => {
            const title = resolveLocalized(project.title, locale).text;
            const summary = resolveLocalized(project.summary, locale).text;
            const primaryMetric = project.metrics[0];

            return (
              <article
                key={project.id}
                className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs hover:border-[var(--accent)]/50 transition-all duration-200"
              >
                {/* Thumbnail Container */}
                <Link
                  href={`/${locale}/work/${project.slug}`}
                  className="relative aspect-16/10 w-full overflow-hidden bg-[var(--surface-hover)] block focus-visible:outline-2 focus-visible:outline-offset-2"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.coverUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />

                  {/* Overlays / Badges */}
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

                  {primaryMetric && (
                    <div className="absolute bottom-3 right-3 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] rounded-lg px-3 py-1.5 shadow-md flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">
                      <span>{primaryMetric.value}</span>
                      <span className="text-[var(--text-muted)] font-normal text-[11px]">
                        {resolveLocalized(primaryMetric.label, locale).text}
                      </span>
                    </div>
                  )}
                </Link>

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
                      href={`/${locale}/work/${project.slug}`}
                      className="focus-visible:outline-2 focus-visible:rounded"
                    >
                      {title}
                    </Link>
                  </h3>

                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 line-clamp-2">
                    {summary}
                  </p>

                  {/* Bottom Action */}
                  <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--text-muted)]">
                      {project.role.split("(")[0]}
                    </span>
                    <Link
                      href={`/${locale}/work/${project.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] group-hover:translate-x-0.5 transition-transform min-h-[44px]"
                    >
                      <span>{messages.work.viewProject}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

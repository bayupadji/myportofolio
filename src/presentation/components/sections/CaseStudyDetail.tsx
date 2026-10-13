"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Users,
  Layers,
  Wrench,
  CheckCircle2,
  ZoomIn,
  Lightbulb,
} from "lucide-react";
import { Project } from "@/domain/entities/Project";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { ReadingProgress } from "../ui/ReadingProgress";
import { useUiStore } from "@/presentation/stores/useUiStore";

export interface CaseStudyDetailProps {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
  locale?: Locale;
  messages: Messages;
}

export const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({
  project,
  prevProject,
  nextProject,
  locale,
  messages,
}) => {
  const { openLightbox } = useUiStore();
  const [activeSection, setActiveSection] = useState<string>("tldr");

  const title = resolveLocalized(project.title, locale).text;
  const summary = resolveLocalized(project.summary, locale).text;

  // Table of Contents definition
  const tocItems = useMemo(
    () => [
      { id: "tldr", label: "TL;DR" },
      ...project.sections.map((s) => ({
        id: s.id,
        label: resolveLocalized(s.title, locale).text,
      })),
      { id: "states", label: messages.caseStudy.solutionStates },
      { id: "learnings", label: messages.caseStudy.learnings },
    ],
    [project.sections, locale, messages.caseStudy.solutionStates, messages.caseStudy.learnings]
  );

  // Scroll spy effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  return (
    <div className="w-full relative">
      <ReadingProgress />

      {/* Hero Header */}
      <div className="w-full border-b border-[var(--border)] bg-[var(--surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline mb-8 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{messages.caseStudy.allProjects}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              {project.category}
            </span>
            {project.isSampleProject && (
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                {messages.work.sampleProjectBadge}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)] leading-tight max-w-4xl mb-4">
            {title}
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-3xl leading-relaxed mb-8">
            {summary}
          </p>

          {/* Key Impact Metrics Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-xs transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:border-[var(--accent)] hover:shadow-lg"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-[var(--accent)]">
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm text-[var(--text-muted)] font-medium mt-0.5">
                  {resolveLocalized(m.label, locale).text}
                </div>
              </div>
            ))}
          </div>

          {/* Project Meta Spec Box */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[var(--border)] text-sm">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5" />
                {messages.caseStudy.role}
              </span>
              <p className="font-semibold text-[var(--text)]">{project.role}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" />
                {messages.caseStudy.duration}
              </span>
              <p className="font-semibold text-[var(--text)]">{project.duration}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1 mb-1">
                <Layers className="w-3.5 h-3.5" />
                {messages.caseStudy.platforms}
              </span>
              <p className="font-semibold text-[var(--text)]">
                {project.platforms.join(", ")}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1 mb-1">
                <Wrench className="w-3.5 h-3.5" />
                {messages.caseStudy.tools}
              </span>
              <p className="font-semibold text-[var(--text)]">
                {project.tools.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Desktop Sticky TOC */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 flex flex-col p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                {messages.caseStudy.toc}
              </span>
              <nav className="flex flex-col gap-1 text-sm" aria-label="Table of contents">
                {tocItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`px-3 py-2 rounded-lg transition-colors text-left font-medium leading-snug ${
                        isActive
                          ? "bg-[var(--accent)]/10 text-[var(--accent)] font-semibold border-l-2 border-[var(--accent)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Case Study Narrative Body */}
          <main className="lg:col-span-9 flex flex-col gap-14 max-w-3xl">
            {/* 1. TL;DR Section */}
            <section
              id="tldr"
              className="p-6 sm:p-8 rounded-2xl border-2 border-[var(--accent)]/30 bg-[var(--accent)]/5 shadow-xs scroll-mt-24"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
                <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
                  {messages.caseStudy.tldr}
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                <div>
                  <span className="font-bold text-[var(--text)] uppercase text-xs tracking-wider block mb-0.5 text-rose-500">
                    {messages.caseStudy.problem}
                  </span>
                  <div
                    className="text-[var(--text)] leading-relaxed [&_strong]:font-bold [&_strong]:text-[var(--text)]"
                    dangerouslySetInnerHTML={{
                      __html: resolveLocalized(project.tldr.problem, locale).text,
                    }}
                  />
                </div>
                <div>
                  <span className="font-bold text-[var(--text)] uppercase text-xs tracking-wider block mb-0.5 text-[var(--accent)]">
                    {messages.caseStudy.solution}
                  </span>
                  <div
                    className="text-[var(--text)] leading-relaxed [&_strong]:font-bold [&_strong]:text-[var(--text)]"
                    dangerouslySetInnerHTML={{
                      __html: resolveLocalized(project.tldr.solution, locale).text,
                    }}
                  />
                </div>
                <div>
                  <span className="font-bold text-[var(--text)] uppercase text-xs tracking-wider block mb-0.5 text-emerald-500">
                    {messages.caseStudy.impact}
                  </span>
                  <div
                    className="text-[var(--text)] leading-relaxed [&_strong]:font-bold [&_strong]:text-[var(--text)]"
                    dangerouslySetInnerHTML={{
                      __html: resolveLocalized(project.tldr.impact, locale).text,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* 2. Structured Sections (Context, Research, Process, Solution, Impact) */}
            {project.sections.map((sec) => {
              const secTitle = resolveLocalized(sec.title, locale).text;
              const secBody = resolveLocalized(sec.body, locale).text;

              return (
                <section key={sec.id} id={sec.id} className="scroll-mt-24">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
                    {secTitle}
                  </h2>

                  <div
                    className="text-base sm:text-lg text-[var(--text)] leading-relaxed mb-6 font-normal prose prose-neutral dark:prose-invert max-w-none [&_strong]:text-[var(--text)] [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1.5 [&_p]:my-2"
                    dangerouslySetInnerHTML={{ __html: secBody }}
                  />

                  {/* Highlights if present */}
                  {sec.highlights && sec.highlights.length > 0 && (
                    <div className="my-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5">
                      {sec.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-[var(--text)]">
                          <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-1" />
                          <span>{resolveLocalized(h, locale).text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section Visual Media */}
                  <div className="my-6">
                    <div
                      className="group relative rounded-xl border border-[var(--border)] overflow-hidden cursor-zoom-in bg-[var(--surface-hover)]"
                      onClick={() =>
                        openLightbox({
                          url: project.coverUrl,
                          alt: secTitle,
                          caption: `${secTitle} - ${title}`,
                        })
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.coverUrl}
                        alt={secTitle}
                        className="w-full h-auto object-cover max-h-[460px] group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-white text-xs flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>{messages.caseStudy.clickToEnlarge}</span>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}

            {/* 3. Solution States Specification Gallery (Default, Empty, Error, Loading) */}
            <section id="states" className="scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)] mb-3 pb-2 border-b border-[var(--border)]">
                {messages.caseStudy.solutionStates}
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)] mb-6">
                {locale === "id"
                  ? "Desain kelas produksi wajib memperhitungkan seluruh kemungkinan state: default, kondisi data kosong, kegagalan sistem, dan persepsi loading."
                  : "Production-grade interfaces require rigorous state modeling: default happy path, clean empty slates, resilient error recoveries, and perceived loading optimizations."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.solutionStates.map((state, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-[var(--accent)] hover:shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)]">
                          State: {state.stateType}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-[var(--text)] mb-2">
                        {resolveLocalized(state.title, locale).text}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        {resolveLocalized(state.description, locale).text}
                      </p>
                    </div>

                    {state.previewUrl && (
                      <button
                        onClick={() =>
                          openLightbox({
                            url: state.previewUrl!,
                            alt: resolveLocalized(state.title, locale).text,
                            caption: resolveLocalized(state.description, locale).text,
                          })
                        }
                        className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Inspect {state.stateType} state</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Key Learnings */}
            <section id="learnings" className="scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
                {messages.caseStudy.learnings}
              </h2>
              <div className="space-y-3">
                {project.learnings.map((l, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-start gap-3 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-md"
                  >
                    <div className="flex h-6 w-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-base text-[var(--text)] leading-relaxed">
                      {resolveLocalized(l, locale).text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Next / Previous Project Navigation */}
            <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevProject ? (
                <Link
                  href={`/work/${prevProject.slug}`}
                  className="flex flex-col items-start p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:border-[var(--accent)] hover:shadow-xl w-full sm:w-1/2"
                >
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mb-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {messages.caseStudy.prevProject}
                  </span>
                  <span className="font-bold text-sm text-[var(--text)] truncate max-w-full">
                    {resolveLocalized(prevProject.title, locale).text}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextProject && (
                <Link
                  href={`/work/${nextProject.slug}`}
                  className="flex flex-col items-end p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:border-[var(--accent)] hover:shadow-xl w-full sm:w-1/2 text-right"
                >
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mb-1">
                    {messages.caseStudy.nextProject}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-bold text-sm text-[var(--text)] truncate max-w-full">
                    {resolveLocalized(nextProject.title, locale).text}
                  </span>
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

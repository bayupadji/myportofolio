"use client";

import React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { HeroMetric } from "@/domain/entities/Profile";
import { LiveStatusPill } from "../ui/LiveStatusPill";
import { CountUp } from "../motion/CountUp";
import { HeroPhoto } from "../ui/HeroPhoto";
import { CardSpotlight } from "../ui/CardSpotlight";

export interface HeroProps {
  locale?: Locale;
  messages: Messages;
  metrics: HeroMetric[];
  availability: string;
  avatarUrl?: string;
  roleText?: string;
  headlineText?: string;
  valueStatementText?: string;
}

export const Hero: React.FC<HeroProps> = ({
  locale,
  messages,
  metrics,
  availability,
  avatarUrl,
  roleText,
  headlineText,
  valueStatementText,
}) => {
  return (
    <section className="relative w-full pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-[var(--border)] overflow-hidden">
      {/* Background ambient gradient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--accent)]/5 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* 2-Column Hero: Content on the Left, Animated Frame on the Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] items-center gap-12 lg:gap-8">
          {/* Left Column: Text, Pill, & CTAs */}
          <div className="flex flex-col items-start max-w-2xl">
            {/* Availability badge with live time */}
            <div className="mb-6 animate-in fade-in duration-300">
              <LiveStatusPill
                availability={availability}
                localTimeLabel={messages.hero.localTime}
                activeHoursLabel={messages.hero.activeWorkingHours}
              />
            </div>

            {/* Role badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
              <span>❖</span>
              <span>{roleText || messages.hero.role}</span>
            </div>

            {/* Heading with 1 H1 per page, using text-balance */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text)] leading-[1.12] mb-6 text-balance">
              {headlineText ? (
                <>
                  {headlineText}
                  <span className="text-[var(--text-muted)] font-bold text-2xl sm:text-4xl block mt-2 text-balance">
                    {valueStatementText || messages.hero.valueStatement}
                  </span>
                </>
              ) : (
                <>
                  Designing digital products that balance <span className="text-[var(--accent)]">human intuition</span> and business growth.
                </>
              )}
            </h1>

            {/* Bio statement with text-pretty */}
            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed mb-6 max-w-xl font-normal text-pretty">
              {valueStatementText || (locale === "id"
                ? "Menghubungkan riset pengguna, arsitektur informasi terstruktur, dan sistem desain scalable untuk menciptakan produk yang cepat diadopsi dan terukur dampaknya."
                : "Bridging qualitative user insights, rigorous information architecture, and scalable design systems to build products people actually love using.")}
            </p>

            {/* Designer Core Craft Spec Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] shadow-2xs">
                <span className="text-[var(--accent)] font-semibold">❖</span> Figma Variables
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] shadow-2xs">
                <span className="text-emerald-500 font-semibold">📐</span> Design Tokens
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] shadow-2xs">
                <span className="text-blue-500 font-semibold">🔍</span> User Research
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] shadow-2xs">
                <span className="text-amber-500 font-semibold">♿</span> WCAG 2.2 AA
              </span>
            </div>

            {/* Dual CTAs (1 Primary, 1 Secondary) */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <a
                href="#case-studies"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById("case-studies");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "#case-studies");
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-base hover:opacity-95 shadow-md shadow-[var(--accent)]/20 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] min-h-[48px] w-full sm:w-auto cursor-pointer"
              >
                <span>{messages.hero.ctaWork}</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-semibold text-base hover:bg-[var(--surface-hover)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] min-h-[48px] w-full sm:w-auto"
              >
                <span>{messages.hero.ctaContact}</span>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Photo Designer Canvas */}
          <div className="flex items-center justify-center lg:justify-end w-full pt-4 lg:pt-0">
            <HeroPhoto
              avatarUrl={avatarUrl}
              name="Bayu"
              role="Product Designer"
              tagline="UI/UX & Systems"
              variant="hero"
            />
          </div>
        </div>

        {/* Metrics Strip (P0 Requirement) with tabular-nums */}
        <div className="mt-16 pt-10 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
              <span>●</span>
              <span>{messages.metrics.title}</span>
            </span>
            <span className="text-xs text-[var(--text-muted)] hidden sm:inline font-mono">
              Verified Business Outcomes
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {metrics.map((metric, idx) => {
              const labelText = resolveLocalized(metric.label, locale).text;
              const descText = resolveLocalized(metric.description, locale).text;
              return (
                <CardSpotlight
                  key={idx}
                  size={240}
                  className="flex flex-col rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-2xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg cursor-default"
                >
                  <div className="flex flex-col p-4 sm:p-5 h-full">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--accent)] mb-1 font-mono tabular-nums">
                      <CountUp value={metric.value} />
                    </span>
                    <span className="text-sm font-bold text-[var(--text)] mb-1 text-balance">
                      {labelText}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] leading-relaxed text-pretty">
                      {descText}
                    </span>
                  </div>
                </CardSpotlight>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

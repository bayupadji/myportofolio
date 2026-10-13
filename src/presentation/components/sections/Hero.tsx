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
}

export const Hero: React.FC<HeroProps> = ({
  locale,
  messages,
  metrics,
  availability,
  avatarUrl,
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
            <p className="text-sm font-semibold tracking-wider uppercase text-[var(--accent)] mb-3">
              {messages.hero.role}
            </p>

            {/* Heading with 1 H1 per page */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text)] leading-[1.15] mb-6">
              Hi, I’m <span className="text-[var(--accent)]">Bayu</span>. <br />
              {messages.hero.valueStatement}
            </h1>

            {/* Bio statement */}
            <p className="text-lg sm:text-xl text-[var(--text-muted)] leading-relaxed mb-8 max-w-xl font-normal">
              {locale === "id"
                ? "Menghubungkan riset pengguna, arsitektur informasi, dan sistem desain untuk menciptakan produk yang cepat diadopsi dan terukur dampaknya."
                : "Bridging qualitative user insights, rigorous information architecture, and scalable design systems to build products people actually love using."}
            </p>

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
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-base hover:opacity-95 shadow-md shadow-[var(--accent)]/20 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-[0.98] min-h-[48px] w-full sm:w-auto cursor-pointer"
              >
                <span>{messages.hero.ctaWork}</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-semibold text-base hover:bg-[var(--surface-hover)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.98] min-h-[48px] w-full sm:w-auto"
              >
                <span>{messages.hero.ctaContact}</span>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Photo Animation (exact indrakusuma.dev style) */}
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

        {/* Metrics Strip (P0 Requirement) */}
        <div className="mt-16 pt-10 border-t border-[var(--border)]">
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {messages.metrics.title}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {metrics.map((metric, idx) => {
              const labelText = resolveLocalized(metric.label, locale).text;
              const descText = resolveLocalized(metric.description, locale).text;
              return (
                <CardSpotlight
                  key={idx}
                  size={240}
                  className="flex flex-col rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-[var(--accent)] hover:shadow-xl cursor-default"
                >
                  <div className="flex flex-col p-4 h-full">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--accent)] mb-1">
                      <CountUp value={metric.value} />
                    </span>
                    <span className="text-sm font-semibold text-[var(--text)] mb-0.5">
                      {labelText}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] leading-relaxed">
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

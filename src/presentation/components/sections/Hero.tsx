import React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { HeroMetric } from "@/domain/entities/Profile";

export interface HeroProps {
  locale: Locale;
  messages: Messages;
  metrics: HeroMetric[];
  availability: string;
}

export const Hero: React.FC<HeroProps> = ({
  locale,
  messages,
  metrics,
  availability,
}) => {
  return (
    <section className="relative w-full pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[var(--border)] overflow-hidden">
      {/* Background ambient gradient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--accent)]/5 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start max-w-3xl">
          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text)] mb-6 shadow-xs animate-in fade-in duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{availability}</span>
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
          <p className="text-lg sm:text-xl text-[var(--text-muted)] leading-relaxed mb-8 max-w-2xl font-normal">
            {locale === "id"
              ? "Menghubungkan riset pengguna, arsitektur informasi, dan sistem desain untuk menciptakan produk yang cepat diadopsi dan terukur dampaknya."
              : "Bridging qualitative user insights, rigorous information architecture, and scalable design systems to build products people actually love using."}
          </p>

          {/* Dual CTAs (1 Primary, 1 Secondary) */}
          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
            <Link
              href={`/${locale}/work`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-base hover:opacity-90 transition-all shadow-md shadow-[var(--accent)]/20 active:scale-[0.98] min-h-[48px] w-full sm:w-auto"
            >
              <span>{messages.hero.ctaWork}</span>
              <ArrowDown className="w-4 h-4" />
            </Link>

            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-semibold text-base hover:bg-[var(--surface-hover)] transition-all active:scale-[0.98] min-h-[48px] w-full sm:w-auto"
            >
              <span>{messages.hero.ctaContact}</span>
              <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)]" />
            </Link>
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
                <div
                  key={idx}
                  className="flex flex-col p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--accent)] mb-1">
                    {metric.value}
                  </span>
                  <span className="text-sm font-semibold text-[var(--text)] mb-0.5">
                    {labelText}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {descText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

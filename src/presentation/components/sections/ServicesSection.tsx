import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";
import { Service } from "@/domain/entities/Service";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { CardSpotlight } from "@/presentation/components/ui/CardSpotlight";

export interface ServicesSectionProps {
  services: Service[];
  locale?: Locale;
  messages: Messages;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  locale,
  messages,
}) => {
  return (
    <div className="w-full py-12 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--accent)] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{messages.services.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)] mb-4">
            {messages.services.title}
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-6">
            {messages.services.subtitle}
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
            </span>
            <span>{messages.services.available}</span>
          </div>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((service) => {
            const title = resolveLocalized(service.title, locale).text;
            const summary = resolveLocalized(service.summary, locale).text;
            const targetAudience = resolveLocalized(service.targetAudience, locale).text;

            return (
              <div
                key={service.id}
                className="flex flex-col p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:border-[var(--accent)] hover:shadow-2xl"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
                    {title}
                  </h2>
                  <span className="px-2.5 py-1 rounded text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)]">
                    {service.status === "available" ? "Active" : "Waitlist"}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed mb-4">
                  {summary}
                </p>

                {/* Target Audience */}
                <div className="mb-6 p-3.5 rounded-lg bg-[var(--surface-hover)] text-xs text-[var(--text-muted)] leading-relaxed">
                  <strong className="text-[var(--text)] font-semibold block mb-0.5">
                    {messages.services.idealFor}:
                  </strong>
                  {targetAudience}
                </div>

                {/* Deliverables List */}
                <div className="mt-auto mb-6">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)] block mb-3">
                    {messages.services.deliverables}:
                  </span>
                  <ul className="space-y-2 text-sm text-[var(--text)]">
                    {service.deliverables.map((deliv, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-pretty">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                        <span>{resolveLocalized(deliv, locale).text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA with preselected freelance topic */}
                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    {messages.services.pricingNote}
                  </span>
                  <Link
                    href="/contact?topic=freelance"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--accent)] hover:underline min-h-[44px]"
                  >
                    <span>{messages.services.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Step "How We Get Started" Workflow Card */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 lg:p-14 text-center shadow-xs overflow-hidden">
          {/* Ambient radial gradient glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--accent)]/10 blur-[100px] pointer-events-none rounded-full"
            aria-hidden="true"
          />

          <div className="relative z-1 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-semibold uppercase tracking-wider mb-4 border border-[var(--accent)]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {locale === "id" ? "Alur Kerja Kolaboratif" : "Collaboration Workflow"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-4 leading-tight text-balance">
              {messages.services.howWeStart}
            </h2>

            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed mb-10 max-w-2xl mx-auto text-pretty">
              {locale === "id"
                ? "Model kolaborasi transparan dan terstruktur yang berfokus pada kejelasan hasil, efisiensi waktu, dan dampak nyata."
                : "A frictionless, transparent engagement model focused on clarity, fast turnaround, and measurable business impact."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10 w-full">
              <CardSpotlight
                size={260}
                className="p-6 rounded-xl bg-[var(--surface-hover)]/70 border border-[var(--border)] shadow-2xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] mb-4 font-mono font-bold text-sm tabular-nums">
                  01
                </div>
                <h3 className="font-bold text-base text-[var(--text)] mb-2 text-balance">
                  {messages.services.step1}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed text-pretty">
                  {messages.services.step1Desc}
                </p>
              </CardSpotlight>

              <CardSpotlight
                size={260}
                className="p-6 rounded-xl bg-[var(--surface-hover)]/70 border border-[var(--border)] shadow-2xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] mb-4 font-mono font-bold text-sm tabular-nums">
                  02
                </div>
                <h3 className="font-bold text-base text-[var(--text)] mb-2 text-balance">
                  {messages.services.step2}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed text-pretty">
                  {messages.services.step2Desc}
                </p>
              </CardSpotlight>

              <CardSpotlight
                size={260}
                className="p-6 rounded-xl bg-[var(--surface-hover)]/70 border border-[var(--border)] shadow-2xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] mb-4 font-mono font-bold text-sm tabular-nums">
                  03
                </div>
                <h3 className="font-bold text-base text-[var(--text)] mb-2 text-balance">
                  {messages.services.step3}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed text-pretty">
                  {messages.services.step3Desc}
                </p>
              </CardSpotlight>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/contact?topic=freelance"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-base hover:opacity-95 shadow-md shadow-[var(--accent)]/20 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] min-h-[48px] w-full sm:w-auto"
              >
                <span>{messages.services.cta}</span>
                <Send className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

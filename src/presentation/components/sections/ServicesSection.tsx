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

export interface ServicesSectionProps {
  services: Service[];
  locale: Locale;
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
                className="flex flex-col p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs hover:border-[var(--accent)]/40 transition-all duration-200"
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
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-3">
                    {messages.services.deliverables}:
                  </span>
                  <ul className="space-y-2 text-sm text-[var(--text)]">
                    {service.deliverables.map((deliv, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                        <span>{resolveLocalized(deliv, locale).text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA with preselected freelance topic */}
                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] italic">
                    {messages.services.pricingNote}
                  </span>
                  <Link
                    href={`/${locale}/contact?topic=freelance`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline min-h-[44px]"
                  >
                    <span>{messages.services.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Step "How We Get Started" Process per PRD Section 10.12 */}
        <div className="p-8 sm:p-12 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/60 text-center max-w-4xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            Workflow
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[var(--text)] mb-3">
            {messages.services.howWeStart}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto mb-10">
            A frictionless, transparent engagement model focused on clarity and fast turnaround.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] mb-3 font-bold">
                1
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mb-1.5">
                {messages.services.step1}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {messages.services.step1Desc}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] mb-3 font-bold">
                2
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mb-1.5">
                {messages.services.step2}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {messages.services.step2Desc}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] mb-3 font-bold">
                3
              </div>
              <h3 className="font-bold text-base text-[var(--text)] mb-1.5">
                {messages.services.step3}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                {messages.services.step3Desc}
              </p>
            </div>
          </div>

          <Link
            href={`/${locale}/contact?topic=freelance`}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-base hover:opacity-90 shadow-md shadow-[var(--accent)]/20 min-h-[48px]"
          >
            <span>{messages.services.cta}</span>
            <Send className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Search, Compass, LayoutGrid, CheckCircle } from "lucide-react";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { CardSpotlight } from "../ui/CardSpotlight";

export interface ProcessSectionProps {
  locale?: Locale;
  messages: Messages;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ messages }) => {
  const steps = [
    {
      icon: <Search className="w-5 h-5 text-[var(--accent)]" />,
      title: messages.process.step1Title,
      desc: messages.process.step1Desc,
    },
    {
      icon: <Compass className="w-5 h-5 text-[var(--accent)]" />,
      title: messages.process.step2Title,
      desc: messages.process.step2Desc,
    },
    {
      icon: <LayoutGrid className="w-5 h-5 text-[var(--accent)]" />,
      title: messages.process.step3Title,
      desc: messages.process.step3Desc,
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-[var(--accent)]" />,
      title: messages.process.step4Title,
      desc: messages.process.step4Desc,
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 border-b border-[var(--border)] bg-[var(--surface-hover)]/40">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            {messages.process.badge}
          </span>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)]">
            {messages.process.title}
          </h2>
          <p className="mt-3 text-base text-[var(--text-muted)]">
            {messages.process.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <CardSpotlight
              key={idx}
              className="flex flex-col rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-[var(--accent)] hover:shadow-xl cursor-default"
            >
              <div className="flex flex-col p-6 h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-base font-bold text-[var(--text)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </section>
  );
};

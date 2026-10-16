import React from "react";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { WorkGrid } from "@/presentation/components/sections/WorkGrid";
import { CtaCardSection } from "@/presentation/components/sections/CtaCardSection";

export const metadata = {
  title: "Selected Work & Case Studies · Bayu UI/UX Designer",
  description:
    "Selected product design case studies across Fintech, Admin Tools, Mobile Apps, and Design Systems.",
};

export default async function WorkPage() {
  const messages = getMessages();
  const [projects, profile] = await Promise.all([
    container.getPublishedProjects.execute(),
    container.getProfile.execute(),
  ]);

  return (
    <div className="flex flex-col w-full">
      <div className="w-full py-12 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] block mb-2">
              {messages.work.badge}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)] mb-4">
              {messages.work.title}
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
              {messages.work.subtitle}
            </p>
          </div>

          <WorkGrid
            projects={projects}
            messages={messages}
          />
        </div>
      </div>
      <CtaCardSection messages={messages} customContent={profile.ctaBanner} />
    </div>
  );
}

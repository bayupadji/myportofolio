import React from "react";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { WorkGrid } from "@/presentation/components/sections/WorkGrid";

interface WorkPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WorkPageProps) {
  const { locale } = await params;
  const isId = locale === "id";

  return {
    title: isId
      ? "Karya & Studi Kasus · Bayu UI/UX Designer"
      : "Selected Work & Case Studies · Bayu UI/UX Designer",
    description: isId
      ? "Koleksi studi kasus desain produk terpilih lintas Fintech, Admin Tools, Aplikasi Mobile, dan Sistem Desain."
      : "Selected product design case studies across Fintech, Admin Tools, Mobile Apps, and Design Systems.",
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale } = await params;
  const validLocale = (locale as Locale) || "en";
  const messages = getMessages(validLocale);

  const projects = await container.getPublishedProjects.execute();

  return (
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
          locale={validLocale}
          messages={messages}
        />
      </div>
    </div>
  );
}

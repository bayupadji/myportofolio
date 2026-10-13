import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { Hero } from "@/presentation/components/sections/Hero";
import { SelectedWork } from "@/presentation/components/sections/SelectedWork";
import { ProcessSection } from "@/presentation/components/sections/ProcessSection";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps) {
  const { locale } = await params;
  const isId = locale === "id";

  return {
    title: isId
      ? "Bayu · Product Designer Generalis (UI/UX) - Portofolio"
      : "Bayu · Generalist Product Designer (UI/UX) - Portfolio",
    description: isId
      ? "Portofolio personal Bayu, Product Designer generalis. Riset, arsitektur informasi, interaksi, dan sistem desain dengan bukti dampak nyata."
      : "Portfolio of Bayu, a generalist Product Designer crafting high-impact digital experiences across web, mobile, and complex systems.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        id: "/id",
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const validLocale = (locale as Locale) || "en";
  const messages = getMessages(validLocale);

  const [profile, projects] = await Promise.all([
    container.getProfile.execute(),
    container.getPublishedProjects.execute(),
  ]);

  const availabilityText = resolveLocalized(profile.availabilityStatus, validLocale).text;

  return (
    <div className="w-full">
      {/* 1. Hero with Proof of Impact & Count-up Metrics */}
      <Hero
        locale={validLocale}
        messages={messages}
        metrics={profile.keyMetrics}
        availability={availabilityText}
        avatarUrl={profile.avatarUrl}
      />

      {/* 2. Selected Work (3-4 Case Studies with "Sample project" Badges) */}
      <SelectedWork
        projects={projects.slice(0, 4)}
        locale={validLocale}
        messages={messages}
        showAllLink={true}
      />

      {/* 3. Evidence-Based 4-Step Process */}
      <ProcessSection locale={validLocale} messages={messages} />

      {/* 4. Bottom High-Impact CTA Banner */}
      <section className="w-full py-16 sm:py-20 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {validLocale === "id"
                ? "Tersedia untuk Peluang Baru"
                : "Open to New Opportunities"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] max-w-2xl mx-auto mb-4">
            {validLocale === "id"
              ? "Punya proyek produk atau peran yang ingin didiskusikan?"
              : "Have a product challenge or an open role to discuss?"}
          </h2>

          <p className="text-base text-[var(--text-muted)] max-w-xl mx-auto mb-8">
            {validLocale === "id"
              ? "Saya siap membantu mentransformasi ide menjadi produk digital yang intuitif, cepat, dan berdampak."
              : "I am ready to help turn your product ideas into intuitive, fast, and measurable digital experiences."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${validLocale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-base hover:opacity-90 shadow-md shadow-[var(--accent)]/20 transition-all min-h-[48px]"
            >
              <span>{messages.hero.ctaContact}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/${validLocale}/services`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-semibold text-base hover:bg-[var(--surface-hover)] transition-all min-h-[48px]"
            >
              <span>{messages.nav.services}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

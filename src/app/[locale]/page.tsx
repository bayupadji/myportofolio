import React from "react";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { Hero } from "@/presentation/components/sections/Hero";
import { SelectedWork } from "@/presentation/components/sections/SelectedWork";
import { ProcessSection } from "@/presentation/components/sections/ProcessSection";
import { CtaCardSection } from "@/presentation/components/sections/CtaCardSection";

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

      {/* 4. Bottom High-Impact CTA Banner Card */}
      <CtaCardSection locale={validLocale} messages={messages} />
    </div>
  );
}

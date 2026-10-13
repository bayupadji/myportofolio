import React from "react";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { AboutSection } from "@/presentation/components/sections/AboutSection";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  const isId = locale === "id";

  return {
    title: isId
      ? "Tentang Bayu · Product Designer Generalis (UI/UX)"
      : "About Bayu · Generalist Product Designer (UI/UX)",
    description: isId
      ? "Latar belakang, filosofi desain, pengalaman karir, dan keahlian teknis Bayu."
      : "Background, design philosophy, career journey, and technical capabilities of Bayu.",
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const validLocale = (locale as Locale) || "en";
  const messages = getMessages(validLocale);

  const [profile, experiences, skills] = await Promise.all([
    container.getProfile.execute(),
    container.getExperiences.execute(),
    container.getSkills.execute(),
  ]);

  return (
    <AboutSection
      profile={profile}
      experiences={experiences}
      skills={skills}
      locale={validLocale}
      messages={messages}
    />
  );
}

import React from "react";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { AboutSection } from "@/presentation/components/sections/AboutSection";
import { CtaCardSection } from "@/presentation/components/sections/CtaCardSection";

export const metadata = {
  title: "About Bayu · Generalist Product Designer (UI/UX)",
  description:
    "Background, design philosophy, career journey, and technical capabilities of Bayu.",
};

export default async function AboutPage() {
  const messages = getMessages();

  const [profile, experiences, skills] = await Promise.all([
    container.getProfile.execute(),
    container.getExperiences.execute(),
    container.getSkills.execute(),
  ]);

  return (
    <div className="flex flex-col w-full">
      <AboutSection
        profile={profile}
        experiences={experiences}
        skills={skills}
        messages={messages}
      />
      <CtaCardSection messages={messages} customContent={profile.ctaBanner} />
    </div>
  );
}

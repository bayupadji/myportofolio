import React from "react";
import { resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { Hero } from "@/presentation/components/sections/Hero";
import { SelectedWork } from "@/presentation/components/sections/SelectedWork";
import { ProcessSection } from "@/presentation/components/sections/ProcessSection";
import { CtaCardSection } from "@/presentation/components/sections/CtaCardSection";

export const metadata = {
  title: "Bayu · Generalist Product Designer (UI/UX) - Portfolio",
  description:
    "Portfolio of Bayu, a generalist Product Designer crafting high-impact digital experiences across web, mobile, and complex systems.",
};

export default async function HomePage() {
  const messages = getMessages();

  const [profile, projects] = await Promise.all([
    container.getProfile.execute(),
    container.getPublishedProjects.execute(),
  ]);

  const availabilityText = resolveLocalized(profile.availabilityStatus).text;

  // Filter and order selected projects if featuredProjectIds are set
  let featuredProjects = projects;
  if (profile.featuredProjectIds && profile.featuredProjectIds.length > 0) {
    const selected = profile.featuredProjectIds
      .map((id) => projects.find((p) => p.id === id))
      .filter((p): p is (typeof projects)[0] => Boolean(p));
    if (selected.length > 0) {
      featuredProjects = selected;
    }
  }

  return (
    <div className="w-full">
      {/* 1. Hero with Proof of Impact & Count-up Metrics */}
      <Hero
        messages={messages}
        metrics={profile.keyMetrics}
        availability={availabilityText}
        avatarUrl={profile.avatarUrl}
        roleText={profile.heroRole ? resolveLocalized(profile.heroRole).text : undefined}
        headlineText={profile.heroHeadline ? resolveLocalized(profile.heroHeadline).text : undefined}
        valueStatementText={
          profile.heroValueStatement
            ? resolveLocalized(profile.heroValueStatement).text
            : undefined
        }
      />

      {/* 2. Selected Work (Featured Case Studies) */}
      <SelectedWork
        projects={featuredProjects.slice(0, 4)}
        messages={messages}
        showAllLink={true}
      />

      {/* 3. Evidence-Based 4-Step Process */}
      <ProcessSection messages={messages} customSteps={profile.processSteps} />

      {/* 4. Bottom High-Impact CTA Banner Card */}
      <CtaCardSection messages={messages} customContent={profile.ctaBanner} />
    </div>
  );
}

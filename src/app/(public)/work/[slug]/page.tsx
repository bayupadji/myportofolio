import React from "react";
import { notFound } from "next/navigation";
import { resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { CaseStudyDetail } from "@/presentation/components/sections/CaseStudyDetail";
import { CtaCardSection } from "@/presentation/components/sections/CtaCardSection";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await container.getPublishedProjects.execute();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = await container.getProjectBySlug.execute(slug);

  if (!project) return { title: "Case Study Not Found" };

  const title = resolveLocalized(project.title).text;
  const summary = resolveLocalized(project.summary).text;

  return {
    title: `${title} · Bayu Product Designer`,
    description: summary,
    openGraph: {
      title,
      description: summary,
      images: [project.coverUrl],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const messages = getMessages();

  const [project, allProjects, profile] = await Promise.all([
    container.getProjectBySlug.execute(slug),
    container.getPublishedProjects.execute(),
    container.getProfile.execute(),
  ]);

  if (!project) {
    notFound();
  }

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="flex flex-col w-full">
      <CaseStudyDetail
        project={project}
        prevProject={prevProject}
        nextProject={nextProject}
        messages={messages}
      />
      <CtaCardSection messages={messages} customContent={profile.ctaBanner} />
    </div>
  );
}

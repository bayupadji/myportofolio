import React from "react";
import { notFound } from "next/navigation";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { CaseStudyDetail } from "@/presentation/components/sections/CaseStudyDetail";

interface CaseStudyPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const projects = await container.getPublishedProjects.execute();
  const params: { locale: string; slug: string }[] = [];

  for (const locale of ["en", "id"]) {
    for (const project of projects) {
      params.push({ locale, slug: project.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { locale, slug } = await params;
  const project = await container.getProjectBySlug.execute(slug);

  if (!project) return { title: "Case Study Not Found" };

  const validLocale = (locale as Locale) || "en";
  const title = resolveLocalized(project.title, validLocale).text;
  const summary = resolveLocalized(project.summary, validLocale).text;

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
  const { locale, slug } = await params;
  const validLocale = (locale as Locale) || "en";
  const messages = getMessages(validLocale);

  const [project, allProjects] = await Promise.all([
    container.getProjectBySlug.execute(slug),
    container.getPublishedProjects.execute(),
  ]);

  if (!project) {
    notFound();
  }

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <CaseStudyDetail
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
      locale={validLocale}
      messages={messages}
    />
  );
}

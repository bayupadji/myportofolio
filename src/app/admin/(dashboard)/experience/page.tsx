import React from "react";
import { container } from "@/infrastructure/container";
import { ExperienceManager } from "@/presentation/components/admin/ExperienceManager";

export const metadata = {
  title: "Pengalaman & Layanan · Bayu Portfolio CMS",
};

export default async function AdminExperiencePage() {
  const [experiences, services] = await Promise.all([
    container.getExperiences.execute(),
    container.getServices.execute(),
  ]);

  return (
    <ExperienceManager
      initialExperiences={experiences}
      initialServices={services}
    />
  );
}

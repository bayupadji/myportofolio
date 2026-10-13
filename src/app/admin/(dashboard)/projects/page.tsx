import React from "react";
import { container } from "@/infrastructure/container";
import { ProjectManager } from "@/presentation/components/admin/ProjectManager";

export const metadata = {
  title: "Manajemen Proyek · Bayu Portfolio CMS",
};

export default async function AdminProjectsPage() {
  const projects = await container.getAllProjects.execute();

  return <ProjectManager initialProjects={projects} />;
}

import React from "react";
import { container } from "@/infrastructure/container";
import { AdminDashboard } from "@/presentation/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard · Bayu Portfolio CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const [projects, messages, profile] = await Promise.all([
    container.getAllProjects.execute(),
    container.getAdminMessages.execute(),
    container.getProfile.execute(),
  ]);

  return (
    <AdminDashboard
      projects={projects}
      messages={messages}
      profile={profile}
    />
  );
}

import React from "react";
import { container } from "@/infrastructure/container";
import { OverviewDashboard } from "@/presentation/components/admin/OverviewDashboard";

export const metadata = {
  title: "Overview Dashboard · Bayu Portfolio CMS",
};

export default async function AdminOverviewPage() {
  const [projects, messages, profile, trafficSummary] = await Promise.all([
    container.getAllProjects.execute(),
    container.getAdminMessages.execute(),
    container.getProfile.execute(),
    container.getTrafficAnalytics.execute(30),
  ]);

  return (
    <OverviewDashboard
      projects={projects}
      messages={messages}
      profile={profile}
      trafficSummary={trafficSummary}
    />
  );
}

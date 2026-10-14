import React from "react";
import { container } from "@/infrastructure/container";
import { LandingPageManager } from "@/presentation/components/admin/LandingPageManager";

export const metadata = {
  title: "Landing Page Manager · Admin",
};

export default async function AdminLandingPage() {
  const [profile, allProjects] = await Promise.all([
    container.getProfile.execute(),
    container.getAllProjects.execute(),
  ]);

  return (
    <div className="w-full">
      <LandingPageManager initialProfile={profile} allProjects={allProjects} />
    </div>
  );
}

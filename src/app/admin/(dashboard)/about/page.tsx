import React from "react";
import { container } from "@/infrastructure/container";
import { AboutManager } from "@/presentation/components/admin/AboutManager";

export const metadata = {
  title: "About Me & Career · Admin",
};

export default async function AdminAboutPage() {
  const [profile, experiences, skills] = await Promise.all([
    container.getProfile.execute(),
    container.getExperiences.execute(),
    container.getSkills.execute(),
  ]);

  return (
    <div className="w-full">
      <AboutManager
        initialProfile={profile}
        initialExperiences={experiences}
        initialSkills={skills}
      />
    </div>
  );
}

import React from "react";
import { container } from "@/infrastructure/container";
import { ProfileManager } from "@/presentation/components/admin/ProfileManager";

export const metadata = {
  title: "Profil & Ketersediaan · Bayu Portfolio CMS",
};

export default async function AdminProfilePage() {
  const profile = await container.getProfile.execute();

  return <ProfileManager initialProfile={profile} />;
}

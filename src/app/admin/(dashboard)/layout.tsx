import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { container } from "@/infrastructure/container";
import { AdminSidebar } from "@/presentation/components/admin/AdminSidebar";
import { AdminTopBar } from "@/presentation/components/admin/AdminTopBar";

export const metadata = {
  title: "Admin Dashboard · Bayu Portfolio CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("portfolio_admin_auth");

  // Protect all dashboard routes (session expires automatically after 5 minutes)
  if (!authCookie || !authCookie.value) {
    redirect("/admin/login?expired=1");
  }

  // Fetch count & availability for sidebar
  const [projects, messages, profile] = await Promise.all([
    container.getAllProjects.execute(),
    container.getAdminMessages.execute(),
    container.getProfile.execute(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <AdminSidebar
        projectCount={projects.length}
        unreadMessageCount={messages.length}
        isAvailable={profile.isAvailableForFreelance}
      />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminTopBar />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

import React from "react";
import { getMessages } from "@/presentation/i18n";
import { Header } from "@/presentation/components/layout/Header";
import { MobileDrawer } from "@/presentation/components/layout/MobileDrawer";
import { Footer } from "@/presentation/components/layout/Footer";
import { OfflineBanner } from "@/presentation/components/layout/OfflineBanner";
import { container } from "@/infrastructure/container";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = getMessages();
  const profile = await container.getProfile.execute();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--text)] transition-colors">
      <OfflineBanner messages={messages} />
      <Header messages={messages} />
      <MobileDrawer messages={messages} />
      <main id="main-content" className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer messages={messages} email={profile.email} />
    </div>
  );
}

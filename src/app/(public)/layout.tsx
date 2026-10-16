import React from "react";
import { getMessages } from "@/presentation/i18n";
import { Header } from "@/presentation/components/layout/Header";
import { MobileDrawer } from "@/presentation/components/layout/MobileDrawer";
import { Footer } from "@/presentation/components/layout/Footer";
import { OfflineBanner } from "@/presentation/components/layout/OfflineBanner";
import { AnalyticsTracker } from "@/presentation/components/layout/AnalyticsTracker";
import { container } from "@/infrastructure/container";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = getMessages();
  const profile = await container.getProfile.execute();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--text)] transition-colors">
      <AnalyticsTracker />
      <OfflineBanner messages={messages} />
      <Header messages={messages} />
      <MobileDrawer messages={messages} cvUrl={profile.cvUrl} />
      <main id="main-content" className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer
        messages={messages}
        email={profile.email}
        socialLinks={profile.socialLinks}
        cvUrl={profile.cvUrl}
        isAvailableForFreelance={profile.isAvailableForFreelance}
      />
    </div>
  );
}

import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { getMessages } from "@/presentation/i18n";
import { Header } from "@/presentation/components/layout/Header";
import { MobileDrawer } from "@/presentation/components/layout/MobileDrawer";
import { Footer } from "@/presentation/components/layout/Footer";
import { OfflineBanner } from "@/presentation/components/layout/OfflineBanner";
import { container } from "@/infrastructure/container";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;

  if (locale !== "en" && locale !== "id") {
    notFound();
  }

  const messages = getMessages(locale);
  const profile = await container.getProfile.execute();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--text)] transition-colors">
      <OfflineBanner messages={messages} />
      <Header locale={locale} messages={messages} />
      <MobileDrawer locale={locale} messages={messages} />
      <main id="main-content" className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer locale={locale} messages={messages} email={profile.email} />
    </div>
  );
}

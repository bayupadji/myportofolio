import React, { Suspense } from "react";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { ContactForm } from "@/presentation/components/sections/ContactForm";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale } = await params;
  const isId = locale === "id";

  return {
    title: isId
      ? "Hubungi Bayu · Peluang Kerja & Freelance"
      : "Contact Bayu · Job Opportunities & Freelance",
    description: isId
      ? "Hubungi Bayu untuk diskusi proyek baru, lowongan full-time, atau konsultasi desain produk."
      : "Get in touch with Bayu for product collaborations, full-time positions, or design advisory.",
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const validLocale = (locale as Locale) || "en";
  const messages = getMessages(validLocale);

  const profile = await container.getProfile.execute();

  return (
    <Suspense fallback={<div className="min-h-screen py-20 flex items-center justify-center text-sm text-[var(--text-muted)]">Loading contact form...</div>}>
      <ContactForm
        email={profile.email}
        locale={validLocale}
        messages={messages}
      />
    </Suspense>
  );
}

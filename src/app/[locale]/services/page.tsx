import React from "react";
import { Locale } from "@/domain/value-objects/LocalizedText";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { ServicesSection } from "@/presentation/components/sections/ServicesSection";

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServicesPageProps) {
  const { locale } = await params;
  const isId = locale === "id";

  return {
    title: isId
      ? "Layanan Desain Produk & Freelance · Bayu UI/UX"
      : "Strategic Product Design Services · Bayu UI/UX",
    description: isId
      ? "Layanan konsultasi dan desain produk freelance: UX Audit, End-to-End Product Design, Arsitektur Design System, dan Prototyping Interaktif."
      : "Freelance consulting and product design services: UX Audits, End-to-End Product Design, Design System Architecture, and Interactive Prototyping.",
  };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const validLocale = (locale as Locale) || "en";
  const messages = getMessages(validLocale);

  const services = await container.getServices.execute();

  return (
    <ServicesSection
      services={services}
      locale={validLocale}
      messages={messages}
    />
  );
}

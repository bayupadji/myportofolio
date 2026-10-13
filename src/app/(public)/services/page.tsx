import React from "react";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { ServicesSection } from "@/presentation/components/sections/ServicesSection";

export const metadata = {
  title: "Strategic Product Design Services · Bayu UI/UX",
  description:
    "Freelance consulting and product design services: UX Audits, End-to-End Product Design, Design System Architecture, and Interactive Prototyping.",
};

export default async function ServicesPage() {
  const messages = getMessages();
  const services = await container.getServices.execute();

  return (
    <ServicesSection
      services={services}
      messages={messages}
    />
  );
}

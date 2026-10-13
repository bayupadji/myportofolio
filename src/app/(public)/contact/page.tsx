import React, { Suspense } from "react";
import { getMessages } from "@/presentation/i18n";
import { container } from "@/infrastructure/container";
import { ContactForm } from "@/presentation/components/sections/ContactForm";

export const metadata = {
  title: "Contact Bayu · Job Opportunities & Freelance",
  description:
    "Get in touch with Bayu for product collaborations, full-time positions, or design advisory.",
};

export default async function ContactPage() {
  const messages = getMessages();
  const profile = await container.getProfile.execute();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20 flex items-center justify-center text-sm text-[var(--text-muted)]">
          Loading contact form...
        </div>
      }
    >
      <ContactForm
        email={profile.email}
        messages={messages}
      />
    </Suspense>
  );
}

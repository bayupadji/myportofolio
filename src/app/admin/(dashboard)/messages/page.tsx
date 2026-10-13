import React from "react";
import { container } from "@/infrastructure/container";
import { MessagesManager } from "@/presentation/components/admin/MessagesManager";

export const metadata = {
  title: "Inbound Messages · Bayu Portfolio CMS",
};

export default async function AdminMessagesPage() {
  const messages = await container.getAdminMessages.execute();

  return <MessagesManager initialMessages={messages} />;
}

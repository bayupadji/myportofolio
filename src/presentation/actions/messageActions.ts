"use server";

import { container } from "@/infrastructure/container";
import { MessageTopic } from "@/domain/entities/Message";

export async function submitContactMessageAction(input: {
  name: string;
  email: string;
  topic: MessageTopic;
  body: string;
}) {
  try {
    if (!input.name || !input.email || !input.body) {
      throw new Error("Name, email, and message body are required.");
    }

    const message = await container.submitContactMessage.execute({
      name: input.name,
      email: input.email,
      topic: input.topic,
      body: input.body,
    });

    return { success: true, message };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit message";
    return { success: false, error: message };
  }
}

export async function updateMessageStatusAction(
  id: string,
  status: "unread" | "read" | "replied"
) {
  try {
    await container.updateMessageStatus(id, status);
    return { success: true, id, status };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update message status";
    return { success: false, error: message };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await container.deleteMessage(id);
    return { success: true, id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete message";
    return { success: false, error: message };
  }
}

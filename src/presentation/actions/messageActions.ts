"use server";

import { container } from "@/infrastructure/container";
import { MessageTopic } from "@/domain/entities/Message";
import { assertAdminSession } from "@/infrastructure/auth/session";
import { revalidatePath } from "next/cache";

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
    await assertAdminSession();
    await container.updateMessageStatus(id, status);

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    return { success: true, id, status };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update message status";
    return { success: false, error: message };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await assertAdminSession();
    await container.deleteMessage(id);

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    return { success: true, id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete message";
    return { success: false, error: message };
  }
}

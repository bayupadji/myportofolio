import { MessageRepository } from "@/domain/repositories/MessageRepository";
import { Message } from "@/domain/entities/Message";
import { db } from "../db";
import { messagesTable } from "../schema";
import { eq, desc } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "../seed";

export class DrizzleMessageRepository implements MessageRepository {
  private initialized = false;

  private async ensureInit() {
    if (!this.initialized) {
      await seedDatabaseIfEmpty();
      this.initialized = true;
    }
  }

  async create(message: Message): Promise<void> {
    await this.ensureInit();
    await db.insert(messagesTable).values(message);
  }

  async submit(message: Omit<Message, "id" | "createdAt" | "status">): Promise<Message> {
    await this.ensureInit();
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();
    const status: "unread" | "read" | "replied" = "unread";

    const newMessage: Message = {
      id,
      name: message.name,
      email: message.email,
      topic: message.topic,
      body: message.body,
      createdAt,
      status,
    };

    await db.insert(messagesTable).values(newMessage);
    return newMessage;
  }

  async getAll(): Promise<Message[]> {
    await this.ensureInit();
    const rows = await db
      .select()
      .from(messagesTable)
      .orderBy(desc(messagesTable.createdAt));

    return rows as Message[];
  }

  async updateStatus(id: string, status: "unread" | "read" | "replied"): Promise<void> {
    await this.ensureInit();
    await db
      .update(messagesTable)
      .set({ status })
      .where(eq(messagesTable.id, id));
  }

  async delete(id: string): Promise<void> {
    await this.ensureInit();
    await db.delete(messagesTable).where(eq(messagesTable.id, id));
  }
}

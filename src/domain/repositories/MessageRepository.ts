import { Message } from "../entities/Message";

export interface MessageRepository {
  create(message: Message): Promise<void>;
  getAll(): Promise<Message[]>;
  updateStatus(id: string, status: "unread" | "read" | "replied"): Promise<void>;
  delete(id: string): Promise<void>;
}

import { Message } from "../entities/Message";

export interface MessageRepository {
  create(message: Message): Promise<void>;
  getAll(): Promise<Message[]>;
  delete(id: string): Promise<void>;
}

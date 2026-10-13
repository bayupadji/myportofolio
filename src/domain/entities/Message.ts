export type MessageTopic = "job" | "freelance" | "other";

export interface Message {
  id: string;
  name: string;
  email: string;
  topic: MessageTopic;
  body: string;
  createdAt: string;
  status: "unread" | "read" | "replied";
}

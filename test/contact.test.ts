import test from "node:test";
import assert from "node:assert/strict";
import { SubmitContactMessage } from "../src/application/use-cases/OtherUseCases";
import { MessageRepository } from "../src/domain/repositories/MessageRepository";
import { Message } from "../src/domain/entities/Message";

class InMemoryMessageRepository implements MessageRepository {
  public messages: Message[] = [];

  async create(message: Message): Promise<void> {
    this.messages.push(message);
  }

  async submit(message: Omit<Message, "id" | "createdAt" | "status">): Promise<Message> {
    const full: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    this.messages.push(full);
    return full;
  }

  async getAll(): Promise<Message[]> {
    return [...this.messages];
  }

  async updateStatus(id: string, status: "unread" | "read" | "replied"): Promise<void> {
    const m = this.messages.find((item) => item.id === id);
    if (m) m.status = status;
  }

  async delete(id: string): Promise<void> {
    this.messages = this.messages.filter((item) => item.id !== id);
  }
}

test("SubmitContactMessage successfully saves valid message", async () => {
  const repo = new InMemoryMessageRepository();
  const useCase = new SubmitContactMessage(repo);

  const result = await useCase.execute({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    topic: "freelance",
    body: "Hello! We would like to hire you for a product design sprint.",
  });

  assert.equal(result.success, true);
  assert.equal(repo.messages.length, 1);
  assert.equal(repo.messages[0].name, "Jane Doe");
  assert.equal(repo.messages[0].email, "jane.doe@example.com");
  assert.equal(repo.messages[0].topic, "freelance");
});

test("SubmitContactMessage discards bot submissions with honeypot silently", async () => {
  const repo = new InMemoryMessageRepository();
  const useCase = new SubmitContactMessage(repo);

  const result = await useCase.execute({
    name: "Spam Bot",
    email: "bot@spammer.org",
    topic: "other",
    body: "Buy our random spam backlinks now!",
    honeypot: "http://spam.link",
  });

  assert.equal(result.success, true);
  assert.equal(repo.messages.length, 0); // Must NOT be saved
});

test("SubmitContactMessage validates name, email, and message length", async () => {
  const repo = new InMemoryMessageRepository();
  const useCase = new SubmitContactMessage(repo);

  await assert.rejects(
    () =>
      useCase.execute({
        name: "J", // Too short
        email: "jane@example.com",
        topic: "other",
        body: "Valid message body here.",
      }),
    { name: "ValidationError" }
  );

  await assert.rejects(
    () =>
      useCase.execute({
        name: "Jane Doe",
        email: "not-an-email",
        topic: "other",
        body: "Valid message body here.",
      }),
    { name: "ValidationError" }
  );

  await assert.rejects(
    () =>
      useCase.execute({
        name: "Jane Doe",
        email: "jane@example.com",
        topic: "other",
        body: "Too short", // < 10 chars
      }),
    { name: "ValidationError" }
  );
});

test("SubmitContactMessage enforces submission rate limit per email", async () => {
  const repo = new InMemoryMessageRepository();
  const useCase = new SubmitContactMessage(repo);
  const email = "frequent.sender@example.com";

  for (let i = 0; i < 3; i++) {
    const res = await useCase.execute({
      name: "Frequent Sender",
      email,
      topic: "other",
      body: `This is legitimate message number ${i + 1}.`,
    });
    assert.equal(res.success, true);
  }

  // 4th message within the same window should be rejected by rate limiting
  await assert.rejects(
    () =>
      useCase.execute({
        name: "Frequent Sender",
        email,
        topic: "other",
        body: "This is the 4th message that should be blocked.",
      }),
    { message: /Too many messages sent/ }
  );
});

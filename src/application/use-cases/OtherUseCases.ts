import { Experience } from "@/domain/entities/Experience";
import { ExperienceRepository } from "@/domain/repositories/ExperienceRepository";
import { Skill } from "@/domain/entities/Skill";
import { SkillRepository } from "@/domain/repositories/SkillRepository";
import { Service } from "@/domain/entities/Service";
import { ServiceRepository } from "@/domain/repositories/ServiceRepository";
import { Message, MessageTopic } from "@/domain/entities/Message";
import { MessageRepository } from "@/domain/repositories/MessageRepository";
import { ValidationError } from "@/domain/errors/DomainError";

export class GetExperiences {
  constructor(private readonly repo: ExperienceRepository) {}

  async execute(): Promise<Experience[]> {
    const list = await this.repo.getAll();
    return list.sort((a, b) => a.order - b.order);
  }
}

export class GetSkills {
  constructor(private readonly repo: SkillRepository) {}

  async execute(): Promise<Skill[]> {
    const list = await this.repo.getAll();
    return list.sort((a, b) => a.order - b.order);
  }
}

export class GetServices {
  constructor(private readonly repo: ServiceRepository) {}

  async execute(): Promise<Service[]> {
    const list = await this.repo.getAll();
    return list.sort((a, b) => a.order - b.order);
  }
}

export class SubmitContactMessage {
  constructor(private readonly repo: MessageRepository) {}

  async execute(input: {
    name: string;
    email: string;
    topic: MessageTopic;
    body: string;
    honeypot?: string;
  }): Promise<{ success: boolean; message: string }> {
    // Spam bot check
    if (input.honeypot && input.honeypot.trim().length > 0) {
      // Silently accept without recording spam
      return { success: true, message: "Message received" };
    }

    if (!input.name || input.name.trim().length < 2) {
      throw new ValidationError("Name is required and must be at least 2 characters.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email || !emailRegex.test(input.email.trim())) {
      throw new ValidationError("A valid email address is required.");
    }

    if (!input.body || input.body.trim().length < 10) {
      throw new ValidationError("Message must be at least 10 characters long.");
    }

    const newMessage: Message = {
      id: "msg-" + Date.now().toString(),
      name: input.name.trim(),
      email: input.email.trim(),
      topic: input.topic || "other",
      body: input.body.trim(),
      createdAt: new Date().toISOString(),
      status: "unread",
    };

    await this.repo.create(newMessage);
    return { success: true, message: "Thank you! Your message has been sent." };
  }
}

export class GetAdminMessages {
  constructor(private readonly repo: MessageRepository) {}

  async execute(): Promise<Message[]> {
    return this.repo.getAll();
  }
}

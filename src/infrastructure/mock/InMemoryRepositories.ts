import { Project } from "@/domain/entities/Project";
import { Profile } from "@/domain/entities/Profile";
import { Experience } from "@/domain/entities/Experience";
import { Skill } from "@/domain/entities/Skill";
import { Service } from "@/domain/entities/Service";
import { Message } from "@/domain/entities/Message";
import { ProjectRepository } from "@/domain/repositories/ProjectRepository";
import { ProfileRepository } from "@/domain/repositories/ProfileRepository";
import { ExperienceRepository } from "@/domain/repositories/ExperienceRepository";
import { SkillRepository } from "@/domain/repositories/SkillRepository";
import { ServiceRepository } from "@/domain/repositories/ServiceRepository";
import { MessageRepository } from "@/domain/repositories/MessageRepository";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";
import {
  seedProfile,
  seedProjects,
  seedExperiences,
  seedSkills,
  seedServices,
} from "./seedData";

export class InMemoryProjectRepository implements ProjectRepository {
  private projects: Project[] = [...seedProjects];

  async getPublished(): Promise<Project[]> {
    return this.projects.filter((p) => p.status === "published");
  }

  async getBySlug(slug: string): Promise<Project | null> {
    const project = this.projects.find((p) => p.slug === slug);
    return project || null;
  }

  async getAll(): Promise<Project[]> {
    return [...this.projects];
  }

  async updateStatus(id: string, status: PublishStatus): Promise<void> {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.projects[idx] = {
        ...this.projects[idx],
        status,
      };
    }
  }
}

export class InMemoryProfileRepository implements ProfileRepository {
  private profile: Profile = { ...seedProfile };

  async getProfile(): Promise<Profile> {
    return this.profile;
  }

  async updateAvailability(
    statusEn: string,
    statusId: string,
    isFreelance: boolean
  ): Promise<void> {
    this.profile = {
      ...this.profile,
      availabilityStatus: { en: statusEn, id: statusId },
      isAvailableForFreelance: isFreelance,
    };
  }
}

export class InMemoryExperienceRepository implements ExperienceRepository {
  private list: Experience[] = [...seedExperiences];

  async getAll(): Promise<Experience[]> {
    return [...this.list];
  }
}

export class InMemorySkillRepository implements SkillRepository {
  private list: Skill[] = [...seedSkills];

  async getAll(): Promise<Skill[]> {
    return [...this.list];
  }
}

export class InMemoryServiceRepository implements ServiceRepository {
  private list: Service[] = [...seedServices];

  async getAll(): Promise<Service[]> {
    return [...this.list];
  }
}

export class InMemoryMessageRepository implements MessageRepository {
  private messages: Message[] = [
    {
      id: "msg-seed-1",
      name: "Sarah Jenkins",
      email: "sarah.j@fintechventures.io",
      topic: "freelance",
      body: "Hi Bayu, we loved the PayPulse case study. We are building a B2B payment portal and would love to collaborate on a design sprint.",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "read",
    },
    {
      id: "msg-seed-2",
      name: "David Chen",
      email: "d.chen@logistics-hq.com",
      topic: "job",
      body: "Impressive work on the OmniFlow control tower. We are currently scouting for a Lead Product Designer for our Singapore headquarters.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: "unread",
    },
  ];

  async create(message: Message): Promise<void> {
    this.messages.unshift(message);
  }

  async getAll(): Promise<Message[]> {
    return [...this.messages];
  }
}

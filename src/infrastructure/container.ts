import { DrizzleProjectRepository } from "./drizzle/repositories/DrizzleProjectRepository";
import { DrizzleProfileRepository } from "./drizzle/repositories/DrizzleProfileRepository";
import { DrizzleExperienceRepository } from "./drizzle/repositories/DrizzleExperienceRepository";
import { DrizzleSkillRepository } from "./drizzle/repositories/DrizzleSkillRepository";
import { DrizzleServiceRepository } from "./drizzle/repositories/DrizzleServiceRepository";
import { DrizzleMessageRepository } from "./drizzle/repositories/DrizzleMessageRepository";
import {
  GetPublishedProjects,
  GetProjectBySlug,
  GetAllProjects,
} from "@/application/use-cases/ProjectUseCases";
import {
  GetProfile,
  UpdateAvailability,
} from "@/application/use-cases/ProfileUseCases";
import {
  GetExperiences,
  GetSkills,
  GetServices,
  SubmitContactMessage,
  GetAdminMessages,
} from "@/application/use-cases/OtherUseCases";
import { ProjectRepository } from "@/domain/repositories/ProjectRepository";
import { ProfileRepository } from "@/domain/repositories/ProfileRepository";
import { ExperienceRepository } from "@/domain/repositories/ExperienceRepository";
import { SkillRepository } from "@/domain/repositories/SkillRepository";
import { ServiceRepository } from "@/domain/repositories/ServiceRepository";
import { MessageRepository } from "@/domain/repositories/MessageRepository";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";
import { Project } from "@/domain/entities/Project";
import { Profile } from "@/domain/entities/Profile";
import { Experience } from "@/domain/entities/Experience";
import { Skill } from "@/domain/entities/Skill";
import { Service } from "@/domain/entities/Service";

// Composition Root (Container)
class Container {
  private projectRepo: ProjectRepository;
  private profileRepo: ProfileRepository;
  private expRepo: ExperienceRepository;
  private skillRepo: SkillRepository;
  private serviceRepo: ServiceRepository;
  private messageRepo: MessageRepository;

  // Use cases
  public readonly getPublishedProjects: GetPublishedProjects;
  public readonly getProjectBySlug: GetProjectBySlug;
  public readonly getAllProjects: GetAllProjects;
  public readonly getProfile: GetProfile;
  public readonly updateAvailability: UpdateAvailability;
  public readonly getExperiences: GetExperiences;
  public readonly getSkills: GetSkills;
  public readonly getServices: GetServices;
  public readonly submitContactMessage: SubmitContactMessage;
  public readonly getAdminMessages: GetAdminMessages;

  constructor() {
    // Instantiate local SQLite Drizzle repositories
    this.projectRepo = new DrizzleProjectRepository();
    this.profileRepo = new DrizzleProfileRepository();
    this.expRepo = new DrizzleExperienceRepository();
    this.skillRepo = new DrizzleSkillRepository();
    this.serviceRepo = new DrizzleServiceRepository();
    this.messageRepo = new DrizzleMessageRepository();

    // Instantiate use cases
    this.getPublishedProjects = new GetPublishedProjects(this.projectRepo);
    this.getProjectBySlug = new GetProjectBySlug(this.projectRepo);
    this.getAllProjects = new GetAllProjects(this.projectRepo);
    this.getProfile = new GetProfile(this.profileRepo);
    this.updateAvailability = new UpdateAvailability(this.profileRepo);
    this.getExperiences = new GetExperiences(this.expRepo);
    this.getSkills = new GetSkills(this.skillRepo);
    this.getServices = new GetServices(this.serviceRepo);
    this.submitContactMessage = new SubmitContactMessage(this.messageRepo);
    this.getAdminMessages = new GetAdminMessages(this.messageRepo);
  }

  async updateProjectStatus(id: string, status: PublishStatus): Promise<void> {
    return this.projectRepo.updateStatus(id, status);
  }

  async saveProject(project: Project): Promise<void> {
    return this.projectRepo.save(project);
  }

  async deleteProject(id: string): Promise<void> {
    return this.projectRepo.delete(id);
  }

  async updateProfile(profile: Profile): Promise<void> {
    return this.profileRepo.updateProfile(profile);
  }

  async saveExperience(experience: Experience): Promise<void> {
    return this.expRepo.save(experience);
  }

  async deleteExperience(id: string): Promise<void> {
    return this.expRepo.delete(id);
  }

  async saveSkill(skill: Skill): Promise<void> {
    return this.skillRepo.save(skill);
  }

  async deleteSkill(id: string): Promise<void> {
    return this.skillRepo.delete(id);
  }

  async saveService(service: Service): Promise<void> {
    return this.serviceRepo.save(service);
  }

  async deleteService(id: string): Promise<void> {
    return this.serviceRepo.delete(id);
  }

  async updateMessageStatus(id: string, status: "unread" | "read" | "replied"): Promise<void> {
    return this.messageRepo.updateStatus(id, status);
  }

  async deleteMessage(id: string): Promise<void> {
    return this.messageRepo.delete(id);
  }
}

// Global singleton for server-side use case invocations
export const container = new Container();

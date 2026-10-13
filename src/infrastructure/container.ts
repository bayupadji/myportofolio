import {
  InMemoryProjectRepository,
  InMemoryProfileRepository,
  InMemoryExperienceRepository,
  InMemorySkillRepository,
  InMemoryServiceRepository,
  InMemoryMessageRepository
} from "./mock/InMemoryRepositories";
import {
  GetPublishedProjects,
  GetProjectBySlug,
  GetAllProjects
} from "@/application/use-cases/ProjectUseCases";
import {
  GetProfile,
  UpdateAvailability
} from "@/application/use-cases/ProfileUseCases";
import {
  GetExperiences,
  GetSkills,
  GetServices,
  SubmitContactMessage,
  GetAdminMessages
} from "@/application/use-cases/OtherUseCases";
import { ProjectRepository } from "@/domain/repositories/ProjectRepository";
import { ProfileRepository } from "@/domain/repositories/ProfileRepository";
import { ExperienceRepository } from "@/domain/repositories/ExperienceRepository";
import { SkillRepository } from "@/domain/repositories/SkillRepository";
import { ServiceRepository } from "@/domain/repositories/ServiceRepository";
import { MessageRepository } from "@/domain/repositories/MessageRepository";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";

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
    // Default to in-memory repositories (or Supabase if credentials present)
    const inMemProj = new InMemoryProjectRepository();
    const inMemProfile = new InMemoryProfileRepository();
    const inMemExp = new InMemoryExperienceRepository();
    const inMemSkill = new InMemorySkillRepository();
    const inMemService = new InMemoryServiceRepository();
    const inMemMsg = new InMemoryMessageRepository();

    this.projectRepo = inMemProj;
    this.profileRepo = inMemProfile;
    this.expRepo = inMemExp;
    this.skillRepo = inMemSkill;
    this.serviceRepo = inMemService;
    this.messageRepo = inMemMsg;

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
}

// Global singleton for server-side use case invocations
export const container = new Container();

import { Project } from "@/domain/entities/Project";
import { ProjectRepository } from "@/domain/repositories/ProjectRepository";

export class GetPublishedProjects {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    const projects = await this.projectRepository.getPublished();
    return projects.sort((a, b) => a.order - b.order);
  }
}

export class GetProjectBySlug {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(slug: string): Promise<Project | null> {
    return this.projectRepository.getBySlug(slug);
  }
}

export class GetAllProjects {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.projectRepository.getAll();
  }
}

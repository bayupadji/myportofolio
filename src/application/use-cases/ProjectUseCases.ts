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

export class SaveProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(project: Project): Promise<void> {
    return this.projectRepository.save(project);
  }
}

export class DeleteProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<void> {
    return this.projectRepository.delete(id);
  }
}

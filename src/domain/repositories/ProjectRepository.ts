import { Project } from "../entities/Project";
import { PublishStatus } from "../value-objects/PublishStatus";

export interface ProjectRepository {
  getPublished(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
  getAll(): Promise<Project[]>;
  updateStatus(id: string, status: PublishStatus): Promise<void>;
  save(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
}

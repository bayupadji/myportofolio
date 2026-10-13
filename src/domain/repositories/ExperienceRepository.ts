import { Experience } from "../entities/Experience";

export interface ExperienceRepository {
  getAll(): Promise<Experience[]>;
  save(experience: Experience): Promise<void>;
  delete(id: string): Promise<void>;
}

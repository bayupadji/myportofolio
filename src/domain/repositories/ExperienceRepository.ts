import { Experience } from "../entities/Experience";

export interface ExperienceRepository {
  getAll(): Promise<Experience[]>;
}

import { Skill } from "../entities/Skill";

export interface SkillRepository {
  getAll(): Promise<Skill[]>;
  save(skill: Skill): Promise<void>;
  delete(id: string): Promise<void>;
}

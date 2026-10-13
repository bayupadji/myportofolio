import { Skill } from "../entities/Skill";

export interface SkillRepository {
  getAll(): Promise<Skill[]>;
}

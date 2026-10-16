import { SkillRepository } from "@/domain/repositories/SkillRepository";
import { Skill } from "@/domain/entities/Skill";
import { db } from "../db";
import { skillsTable } from "../schema";
import { eq, asc } from "drizzle-orm";

export class DrizzleSkillRepository implements SkillRepository {
  async getAll(): Promise<Skill[]> {
    const rows = await db
      .select()
      .from(skillsTable)
      .orderBy(asc(skillsTable.order));

    return rows as Skill[];
  }

  async save(skill: Skill): Promise<void> {
    const values = {
      id: skill.id,
      group: skill.group,
      name: skill.name,
      level: skill.level,
      order: skill.order,
    };

    await db
      .insert(skillsTable)
      .values(values)
      .onConflictDoUpdate({
        target: skillsTable.id,
        set: values,
      });
  }

  async delete(id: string): Promise<void> {
    await db.delete(skillsTable).where(eq(skillsTable.id, id));
  }
}

import { SkillRepository } from "@/domain/repositories/SkillRepository";
import { Skill } from "@/domain/entities/Skill";
import { db } from "../db";
import { skillsTable } from "../schema";
import { eq, asc } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "../seed";

export class DrizzleSkillRepository implements SkillRepository {
  private initialized = false;

  private async ensureInit() {
    if (!this.initialized) {
      await seedDatabaseIfEmpty();
      this.initialized = true;
    }
  }

  async getAll(): Promise<Skill[]> {
    await this.ensureInit();
    const rows = await db
      .select()
      .from(skillsTable)
      .orderBy(asc(skillsTable.order));

    return rows as Skill[];
  }

  async save(skill: Skill): Promise<void> {
    await this.ensureInit();
    const [existing] = await db
      .select({ id: skillsTable.id })
      .from(skillsTable)
      .where(eq(skillsTable.id, skill.id))
      .limit(1);

    if (existing) {
      await db
        .update(skillsTable)
        .set({
          group: skill.group,
          name: skill.name,
          level: skill.level,
          order: skill.order,
        })
        .where(eq(skillsTable.id, skill.id));
    } else {
      await db.insert(skillsTable).values({
        id: skill.id,
        group: skill.group,
        name: skill.name,
        level: skill.level,
        order: skill.order,
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.ensureInit();
    await db.delete(skillsTable).where(eq(skillsTable.id, id));
  }
}

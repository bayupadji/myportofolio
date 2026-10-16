import { ExperienceRepository } from "@/domain/repositories/ExperienceRepository";
import { Experience } from "@/domain/entities/Experience";
import { db } from "../db";
import { experiencesTable } from "../schema";
import { eq, asc } from "drizzle-orm";

export class DrizzleExperienceRepository implements ExperienceRepository {
  async getAll(): Promise<Experience[]> {
    const rows = await db
      .select()
      .from(experiencesTable)
      .orderBy(asc(experiencesTable.order));

    return rows as Experience[];
  }

  async save(experience: Experience): Promise<void> {
    const values = {
      id: experience.id,
      company: experience.company,
      role: experience.role,
      period: experience.period,
      location: experience.location,
      bullets: experience.bullets,
      skillsUsed: experience.skillsUsed,
      logoUrl: experience.logoUrl,
      order: experience.order,
    };

    await db
      .insert(experiencesTable)
      .values(values)
      .onConflictDoUpdate({
        target: experiencesTable.id,
        set: values,
      });
  }

  async delete(id: string): Promise<void> {
    await db.delete(experiencesTable).where(eq(experiencesTable.id, id));
  }
}

import { ExperienceRepository } from "@/domain/repositories/ExperienceRepository";
import { Experience } from "@/domain/entities/Experience";
import { db } from "../db";
import { experiencesTable } from "../schema";
import { eq, asc } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "../seed";

export class DrizzleExperienceRepository implements ExperienceRepository {
  private initialized = false;

  private async ensureInit() {
    if (!this.initialized) {
      await seedDatabaseIfEmpty();
      this.initialized = true;
    }
  }

  async getAll(): Promise<Experience[]> {
    await this.ensureInit();
    const rows = await db
      .select()
      .from(experiencesTable)
      .orderBy(asc(experiencesTable.order));

    return rows as Experience[];
  }

  async save(experience: Experience): Promise<void> {
    await this.ensureInit();
    const [existing] = await db
      .select({ id: experiencesTable.id })
      .from(experiencesTable)
      .where(eq(experiencesTable.id, experience.id))
      .limit(1);

    if (existing) {
      await db
        .update(experiencesTable)
        .set({
          company: experience.company,
          role: experience.role,
          period: experience.period,
          location: experience.location,
          bullets: experience.bullets,
          skillsUsed: experience.skillsUsed,
          logoUrl: experience.logoUrl,
          order: experience.order,
        })
        .where(eq(experiencesTable.id, experience.id));
    } else {
      await db.insert(experiencesTable).values({
        id: experience.id,
        company: experience.company,
        role: experience.role,
        period: experience.period,
        location: experience.location,
        bullets: experience.bullets,
        skillsUsed: experience.skillsUsed,
        logoUrl: experience.logoUrl,
        order: experience.order,
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.ensureInit();
    await db.delete(experiencesTable).where(eq(experiencesTable.id, id));
  }
}

import { ProfileRepository } from "@/domain/repositories/ProfileRepository";
import { Profile } from "@/domain/entities/Profile";
import { db } from "../db";
import { profileTable } from "../schema";
import { eq } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "../seed";

export class DrizzleProfileRepository implements ProfileRepository {
  private initialized = false;

  private async ensureInit() {
    if (!this.initialized) {
      await seedDatabaseIfEmpty();
      this.initialized = true;
    }
  }

  async getProfile(): Promise<Profile> {
    await this.ensureInit();
    const [row] = await db.select().from(profileTable).limit(1);
    if (!row) {
      throw new Error("Profile record not found in database.");
    }
    return row as Profile;
  }

  async updateAvailability(
    statusEn: string,
    statusId: string,
    isFreelance: boolean
  ): Promise<void> {
    await this.ensureInit();
    const [row] = await db.select({ id: profileTable.id }).from(profileTable).limit(1);
    if (row) {
      await db
        .update(profileTable)
        .set({
          availabilityStatus: { en: statusEn, id: statusId },
          isAvailableForFreelance: isFreelance,
        })
        .where(eq(profileTable.id, row.id));
    }
  }

  async updateProfile(profile: Profile): Promise<void> {
    await this.ensureInit();
    const [existing] = await db
      .select({ id: profileTable.id })
      .from(profileTable)
      .where(eq(profileTable.id, profile.id))
      .limit(1);

    if (existing) {
      await db
        .update(profileTable)
        .set({
          name: profile.name,
          role: profile.role,
          headline: profile.headline,
          summary: profile.summary,
          location: profile.location,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
          cvUrl: profile.cvUrl,
          availabilityStatus: profile.availabilityStatus,
          isAvailableForFreelance: profile.isAvailableForFreelance,
          socialLinks: profile.socialLinks,
          keyMetrics: profile.keyMetrics,
          heroRole: profile.heroRole,
          heroHeadline: profile.heroHeadline,
          heroValueStatement: profile.heroValueStatement,
          featuredProjectIds: profile.featuredProjectIds,
          processSteps: profile.processSteps,
          ctaBanner: profile.ctaBanner,
        })
        .where(eq(profileTable.id, profile.id));
    } else {
      await db.insert(profileTable).values({
        id: profile.id,
        name: profile.name,
        role: profile.role,
        headline: profile.headline,
        summary: profile.summary,
        location: profile.location,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        cvUrl: profile.cvUrl,
        availabilityStatus: profile.availabilityStatus,
        isAvailableForFreelance: profile.isAvailableForFreelance,
        socialLinks: profile.socialLinks,
        keyMetrics: profile.keyMetrics,
        heroRole: profile.heroRole,
        heroHeadline: profile.heroHeadline,
        heroValueStatement: profile.heroValueStatement,
        featuredProjectIds: profile.featuredProjectIds,
        processSteps: profile.processSteps,
        ctaBanner: profile.ctaBanner,
      });
    }
  }
}

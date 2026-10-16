import { ProfileRepository } from "@/domain/repositories/ProfileRepository";
import { Profile } from "@/domain/entities/Profile";
import { db } from "../db";
import { profileTable } from "../schema";
import { eq } from "drizzle-orm";

export class DrizzleProfileRepository implements ProfileRepository {
  async getProfile(): Promise<Profile> {
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
    const values = {
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
    };

    await db
      .insert(profileTable)
      .values(values)
      .onConflictDoUpdate({
        target: profileTable.id,
        set: values,
      });
  }
}

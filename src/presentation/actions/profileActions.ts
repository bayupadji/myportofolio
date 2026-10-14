"use server";

import { container } from "@/infrastructure/container";
import { Profile } from "@/domain/entities/Profile";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(profile: Profile) {
  try {
    if (!profile.id || !profile.name) {
      throw new Error("Missing required profile fields.");
    }

    await container.updateProfile(profile);

    // Revalidate public landing and about pages
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/services");

    return { success: true, profile };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return { success: false, error: message };
  }
}

export async function updateAvailabilityAction(
  statusEn: string,
  statusId: string,
  isFreelance: boolean
) {
  try {
    await container.updateAvailability.execute(statusEn, statusId, isFreelance);

    revalidatePath("/");
    revalidatePath("/services");

    return { success: true, statusEn, statusId, isFreelance };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update availability";
    return { success: false, error: message };
  }
}

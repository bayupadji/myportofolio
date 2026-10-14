"use server";

import { container } from "@/infrastructure/container";
import { Experience } from "@/domain/entities/Experience";
import { revalidatePath } from "next/cache";

export async function saveExperienceAction(experience: Experience) {
  try {
    if (!experience.id || !experience.company) {
      throw new Error("Missing required experience fields.");
    }

    await container.saveExperience(experience);

    revalidatePath("/about");
    revalidatePath("/");

    return { success: true, experience };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save experience";
    return { success: false, error: message };
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    if (!id) {
      throw new Error("Experience ID is required.");
    }

    await container.deleteExperience(id);

    revalidatePath("/about");
    revalidatePath("/");

    return { success: true, id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete experience";
    return { success: false, error: message };
  }
}

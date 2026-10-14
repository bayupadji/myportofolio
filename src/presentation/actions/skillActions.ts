"use server";

import { container } from "@/infrastructure/container";
import { Skill } from "@/domain/entities/Skill";
import { revalidatePath } from "next/cache";

export async function saveSkillAction(skill: Skill) {
  try {
    if (!skill.id || !skill.name) {
      throw new Error("Missing required skill fields.");
    }

    await container.saveSkill(skill);

    revalidatePath("/about");

    return { success: true, skill };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save skill";
    return { success: false, error: message };
  }
}

export async function deleteSkillAction(id: string) {
  try {
    if (!id) {
      throw new Error("Skill ID is required.");
    }

    await container.deleteSkill(id);

    revalidatePath("/about");

    return { success: true, id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete skill";
    return { success: false, error: message };
  }
}

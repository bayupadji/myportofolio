"use server";

import { container } from "@/infrastructure/container";
import { Skill } from "@/domain/entities/Skill";
import { revalidatePath } from "next/cache";
import { assertAdminSession } from "@/infrastructure/auth/session";

export async function saveSkillAction(skill: Skill) {
  try {
    await assertAdminSession();

    if (!skill.id || !skill.name) {
      throw new Error("Missing required skill fields.");
    }

    await container.saveSkill(skill);

    revalidatePath("/about");
    revalidatePath("/admin/about");
    revalidatePath("/admin");

    return { success: true, skill };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save skill";
    return { success: false, error: message };
  }
}

export async function deleteSkillAction(id: string) {
  try {
    await assertAdminSession();

    if (!id) {
      throw new Error("Skill ID is required.");
    }

    await container.deleteSkill(id);

    revalidatePath("/about");
    revalidatePath("/admin/about");
    revalidatePath("/admin");

    return { success: true, id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete skill";
    return { success: false, error: message };
  }
}

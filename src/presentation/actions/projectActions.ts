"use server";

import { container } from "@/infrastructure/container";
import { Project } from "@/domain/entities/Project";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";
import { revalidatePath } from "next/cache";
import { assertAdminSession } from "@/infrastructure/auth/session";

export async function saveProjectAction(project: Project) {
  try {
    await assertAdminSession();

    if (!project.id || !project.slug || !project.title?.en) {
      throw new Error("Missing required project fields: id, slug, or title.");
    }

    await container.saveProject(project);

    // Revalidate public routes
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath(`/work/${project.slug}`);

    return { success: true, project };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save project";
    return { success: false, error: message };
  }
}

export async function updateProjectStatusAction(id: string, status: PublishStatus) {
  try {
    await assertAdminSession();

    if (!id || !status) {
      throw new Error("Project ID and status are required.");
    }

    await container.updateProjectStatus(id, status);

    // Revalidate public routes
    revalidatePath("/");
    revalidatePath("/work");

    return { success: true, id, status };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update project status";
    return { success: false, error: message };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await assertAdminSession();

    if (!id) {
      throw new Error("Project ID is required.");
    }

    await container.deleteProject(id);

    // Revalidate public routes
    revalidatePath("/");
    revalidatePath("/work");

    return { success: true, id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete project";
    return { success: false, error: message };
  }
}

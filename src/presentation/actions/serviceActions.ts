"use server";

import { container } from "@/infrastructure/container";
import { Service } from "@/domain/entities/Service";
import { revalidatePath } from "next/cache";

export async function saveServiceAction(service: Service) {
  try {
    if (!service.id || !service.slug || !service.title?.en) {
      throw new Error("Missing required service fields.");
    }

    await container.saveService(service);

    revalidatePath("/services");

    return { success: true, service };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save service";
    return { success: false, error: message };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    if (!id) {
      throw new Error("Service ID is required.");
    }

    await container.deleteService(id);

    revalidatePath("/services");

    return { success: true, id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete service";
    return { success: false, error: message };
  }
}

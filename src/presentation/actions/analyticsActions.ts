"use server";

import { container } from "@/infrastructure/container";
import { assertAdminSession } from "@/infrastructure/auth/session";
import { TrafficSummary } from "@/domain/entities/Analytics";

export async function getTrafficSummaryAction(days = 30): Promise<{
  success: boolean;
  data?: TrafficSummary;
  error?: string;
}> {
  try {
    await assertAdminSession();
    const data = await container.getTrafficAnalytics.execute(days);
    return { success: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load traffic summary";
    return { success: false, error: message };
  }
}

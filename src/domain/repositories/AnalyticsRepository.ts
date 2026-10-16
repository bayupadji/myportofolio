import { PageView, TrafficSummary } from "@/domain/entities/Analytics";

export interface AnalyticsRepository {
  recordPageView(view: Omit<PageView, "id" | "createdAt">): Promise<void>;
  getTrafficSummary(days?: number): Promise<TrafficSummary>;
}

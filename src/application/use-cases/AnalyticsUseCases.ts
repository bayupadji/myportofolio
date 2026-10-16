import { AnalyticsRepository } from "@/domain/repositories/AnalyticsRepository";
import { TrafficSummary } from "@/domain/entities/Analytics";

export class RecordPageView {
  constructor(private analyticsRepo: AnalyticsRepository) {}

  async execute(path: string, referrer?: string | null, visitorHash?: string): Promise<void> {
    // Sanitize path (strip query params and keep under 250 chars)
    const cleanPath = (path || "/").split("?")[0].slice(0, 250);
    const cleanReferrer = referrer ? referrer.slice(0, 500) : null;
    const cleanHash = visitorHash || "anon";

    await this.analyticsRepo.recordPageView({
      path: cleanPath,
      referrer: cleanReferrer,
      visitorHash: cleanHash,
    });
  }
}

export class GetTrafficAnalytics {
  constructor(private analyticsRepo: AnalyticsRepository) {}

  async execute(days = 30): Promise<TrafficSummary> {
    return this.analyticsRepo.getTrafficSummary(days);
  }
}

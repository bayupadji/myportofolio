import { AnalyticsRepository } from "@/domain/repositories/AnalyticsRepository";
import {
  PageView,
  TrafficSummary,
  DailyTrafficPoint,
  PageStat,
  ReferrerStat,
} from "@/domain/entities/Analytics";
import { sqlite } from "../db";

export class DrizzleAnalyticsRepository implements AnalyticsRepository {
  async recordPageView(view: Omit<PageView, "id" | "createdAt">): Promise<void> {
    const id = `pv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();

    const stmt = sqlite.prepare(`
      INSERT INTO page_views (id, path, referrer, visitor_hash, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, view.path, view.referrer, view.visitorHash, createdAt);
  }

  async getTrafficSummary(days = 30): Promise<TrafficSummary> {
    const safeDays = days === 7 ? 7 : 30;
    const now = new Date();
    const currentCutoff = new Date(now.getTime() - safeDays * 24 * 60 * 60 * 1000).toISOString();
    const prevCutoff = new Date(now.getTime() - safeDays * 2 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Current period totals
    const currentTotals = sqlite
      .prepare(`
        SELECT 
          COUNT(*) as totalViews, 
          COUNT(DISTINCT visitor_hash) as totalUniques
        FROM page_views
        WHERE created_at >= ?
      `)
      .get(currentCutoff) as { totalViews: number; totalUniques: number } | undefined;

    // 2. Previous period totals for trend calculation
    const prevTotals = sqlite
      .prepare(`
        SELECT 
          COUNT(*) as totalViews, 
          COUNT(DISTINCT visitor_hash) as totalUniques
        FROM page_views
        WHERE created_at >= ? AND created_at < ?
      `)
      .get(prevCutoff, currentCutoff) as { totalViews: number; totalUniques: number } | undefined;

    const totalViews = currentTotals?.totalViews || 0;
    const totalUniques = currentTotals?.totalUniques || 0;
    const prevViews = prevTotals?.totalViews || 0;
    const prevUniques = prevTotals?.totalUniques || 0;

    const viewsChangePercent =
      prevViews === 0 ? 100 : Math.round(((totalViews - prevViews) / prevViews) * 100);
    const uniquesChangePercent =
      prevUniques === 0 ? 100 : Math.round(((totalUniques - prevUniques) / prevUniques) * 100);

    // 3. Daily points aggregation
    const dailyRows = sqlite
      .prepare(`
        SELECT 
          strftime('%Y-%m-%d', created_at) as day,
          COUNT(*) as views,
          COUNT(DISTINCT visitor_hash) as uniques
        FROM page_views
        WHERE created_at >= ?
        GROUP BY day
        ORDER BY day ASC
      `)
      .all(currentCutoff) as { day: string; views: number; uniques: number }[];

    const dailyMap = new Map<string, { views: number; uniques: number }>();
    for (const row of dailyRows) {
      dailyMap.set(row.day, { views: row.views, uniques: row.uniques });
    }

    const dailyPoints: DailyTrafficPoint[] = [];
    for (let i = safeDays - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const isoDay = d.toISOString().split("T")[0];
      const entry = dailyMap.get(isoDay) || { views: 0, uniques: 0 };

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dayNum = d.getDate();
      const monthStr = monthNames[d.getMonth()];
      const label = safeDays === 7 ? `${dayNum} ${monthStr}` : `${dayNum} ${monthStr}`;

      dailyPoints.push({
        date: isoDay,
        label,
        views: entry.views,
        uniques: entry.uniques,
      });
    }

    // 4. Top Pages
    const topPagesRows = sqlite
      .prepare(`
        SELECT 
          path, 
          COUNT(*) as views
        FROM page_views
        WHERE created_at >= ?
        GROUP BY path
        ORDER BY views DESC
        LIMIT 5
      `)
      .all(currentCutoff) as { path: string; views: number }[];

    const topPages: PageStat[] = topPagesRows.map((r) => ({
      path: r.path,
      views: r.views,
      percentage: totalViews > 0 ? Math.round((r.views / totalViews) * 100) : 0,
    }));

    // 5. Top Referrers
    const topRefRows = sqlite
      .prepare(`
        SELECT 
          referrer, 
          COUNT(*) as count
        FROM page_views
        WHERE created_at >= ?
        GROUP BY referrer
        ORDER BY count DESC
        LIMIT 5
      `)
      .all(currentCutoff) as { referrer: string | null; count: number }[];

    const topReferrers: ReferrerStat[] = topRefRows.map((r) => {
      let sourceName = "Direct / Referral";
      if (r.referrer) {
        try {
          const parsed = new URL(r.referrer);
          sourceName = parsed.hostname.replace(/^www\./, "");
        } catch {
          sourceName = r.referrer;
        }
      }

      return {
        source: sourceName,
        count: r.count,
        percentage: totalViews > 0 ? Math.round((r.count / totalViews) * 100) : 0,
      };
    });

    return {
      timeframe: safeDays === 7 ? "7d" : "30d",
      totalViews,
      totalUniques,
      viewsChangePercent,
      uniquesChangePercent,
      dailyPoints,
      topPages,
      topReferrers,
    };
  }
}

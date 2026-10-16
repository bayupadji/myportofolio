export interface PageView {
  id: string;
  path: string;
  referrer: string | null;
  visitorHash: string;
  createdAt: string;
}

export interface DailyTrafficPoint {
  date: string; // YYYY-MM-DD
  label: string; // "10 Oct"
  views: number;
  uniques: number;
}

export interface PageStat {
  path: string;
  views: number;
  percentage: number;
}

export interface ReferrerStat {
  source: string;
  count: number;
  percentage: number;
}

export interface TrafficSummary {
  timeframe: "7d" | "30d";
  totalViews: number;
  totalUniques: number;
  viewsChangePercent: number;
  uniquesChangePercent: number;
  dailyPoints: DailyTrafficPoint[];
  topPages: PageStat[];
  topReferrers: ReferrerStat[];
}

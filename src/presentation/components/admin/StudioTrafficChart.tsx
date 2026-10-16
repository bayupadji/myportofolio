"use client";

import React, { useState, useTransition } from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Globe,
  Compass,
  BarChart2,
} from "lucide-react";
import { TrafficSummary } from "@/domain/entities/Analytics";
import { getTrafficSummaryAction } from "@/presentation/actions/analyticsActions";
import { toast } from "@/presentation/components/ui/Toast";

interface StudioTrafficChartProps {
  initialSummary: TrafficSummary;
}

function generateSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const cpX = (current.x + next.x) / 2;
    path += ` C ${cpX} ${current.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }
  return path;
}

export const StudioTrafficChart: React.FC<StudioTrafficChartProps> = ({
  initialSummary,
}) => {
  const [summary, setSummary] = useState<TrafficSummary>(initialSummary);
  const [timeframe, setTimeframe] = useState<7 | 30>(initialSummary.timeframe === "7d" ? 7 : 30);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleTimeframeChange = (days: 7 | 30) => {
    setTimeframe(days);
    setHoverIndex(null);
    startTransition(async () => {
      const res = await getTrafficSummaryAction(days);
      if (res.success && res.data) {
        setSummary(res.data);
      } else {
        toast.error("Failed to load traffic timeframe.");
      }
    });
  };

  const points = summary.dailyPoints;
  const maxViews = Math.max(...points.map((p) => p.views), 10);
  const chartHeight = 220;
  const chartWidth = 700;
  const paddingX = 20;
  const paddingY = 24;

  const drawableHeight = chartHeight - paddingY * 2;
  const drawableWidth = chartWidth - paddingX * 2;

  // Map data to SVG coordinates
  const svgCoordinates = points.map((p, index) => {
    const x = paddingX + (index / Math.max(points.length - 1, 1)) * drawableWidth;
    const y = chartHeight - paddingY - (p.views / maxViews) * drawableHeight;
    const uniqueY = chartHeight - paddingY - (p.uniques / maxViews) * drawableHeight;
    return { x, y, uniqueY, point: p };
  });

  const viewsPath = generateSmoothPath(
    svgCoordinates.map((c) => ({ x: c.x, y: c.y }))
  );

  const uniquesPath = generateSmoothPath(
    svgCoordinates.map((c) => ({ x: c.x, y: c.uniqueY }))
  );

  const areaPath =
    svgCoordinates.length > 0
      ? `${viewsPath} L ${svgCoordinates[svgCoordinates.length - 1].x} ${chartHeight - paddingY} L ${svgCoordinates[0].x} ${chartHeight - paddingY} Z`
      : "";

  const activeCoord =
    hoverIndex !== null && svgCoordinates[hoverIndex]
      ? svgCoordinates[hoverIndex]
      : svgCoordinates[svgCoordinates.length - 1];

  const avgDailyViews = Math.round(summary.totalViews / points.length);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs space-y-6">
      {/* Header with Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0 border border-[var(--accent)]/20 shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--text)]">
                Audience & Traffic Intelligence
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/25 font-mono">
                Real-time Beacon
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Live pageviews, recruiter visits, and organic inbound discovery without third-party tracking cookies.
            </p>
          </div>
        </div>

        {/* Timeframe Selector Pill */}
        <div className="flex items-center gap-1 p-1 bg-[var(--background)] border border-[var(--border)] rounded-xl self-start sm:self-auto">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleTimeframeChange(7)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              timeframe === 7
                ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleTimeframeChange(30)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              timeframe === 30
                ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pageviews */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
              Total Pageviews
            </span>
            <span
              className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded ${
                summary.viewsChangePercent >= 0
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}
            >
              {summary.viewsChangePercent >= 0 ? "+" : ""}
              {summary.viewsChangePercent}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-mono tabular-nums">
            {summary.totalViews.toLocaleString()}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] block">
            vs previous {timeframe} days
          </span>
        </div>

        {/* Unique Visitors */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-500" />
              Unique Visitors
            </span>
            <span
              className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded ${
                summary.uniquesChangePercent >= 0
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}
            >
              {summary.uniquesChangePercent >= 0 ? "+" : ""}
              {summary.uniquesChangePercent}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-mono tabular-nums">
            {summary.totalUniques.toLocaleString()}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] block">
            Hashed daily sessions
          </span>
        </div>

        {/* Avg Daily Views */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
              Avg. Daily Traffic
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-mono tabular-nums">
            ~{avgDailyViews}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] block">
            hits/day over {timeframe}d
          </span>
        </div>

        {/* Top Channel */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-violet-500" />
              Top Referral Channel
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-[var(--text)] truncate">
            {summary.topReferrers[0]?.source || "Direct Traffic"}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] block">
            {summary.topReferrers[0]?.percentage || 0}% of incoming visits
          </span>
        </div>
      </div>

      {/* Main Grid: Chart on Left (8 cols) + Top Pages/Referrers on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive SVG Smooth Area Chart (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                <span className="font-semibold text-[var(--text)]">Total Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span className="font-medium text-[var(--text-muted)]">Unique Visitors</span>
              </div>
            </div>

            {/* Live Hover Tooltip Snapshot */}
            {activeCoord && (
              <div className="text-xs font-mono text-[var(--text)] bg-[var(--background)] px-2.5 py-1 rounded-lg border border-[var(--border)] shadow-2xs animate-in fade-in duration-150">
                <span className="text-[var(--text-muted)] font-sans">{activeCoord.point.label}: </span>
                <span className="font-bold text-[var(--accent)]">{activeCoord.point.views} views</span>
                <span className="text-[var(--text-muted)]"> · </span>
                <span className="font-semibold text-sky-400">{activeCoord.point.uniques} uniques</span>
              </div>
            )}
          </div>

          {/* SVG Area Visualization */}
          <div className="relative w-full overflow-hidden select-none">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 sm:h-64 overflow-visible"
              onMouseLeave={() => setHoverIndex(null)}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                  <stop offset="90%" stopColor="var(--accent)" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="uniquesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                  <stop offset="90%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = chartHeight - paddingY - pct * drawableHeight;
                const val = Math.round(pct * maxViews);
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      className="text-[var(--border)] opacity-60"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX}
                      y={y - 4}
                      className="text-[9px] fill-[var(--text-muted)] font-mono opacity-70"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area Under Curve */}
              {areaPath && (
                <path
                  d={areaPath}
                  fill="url(#areaGradient)"
                  className="transition-all duration-300"
                />
              )}

              {/* Uniques Line */}
              {uniquesPath && (
                <path
                  d={uniquesPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  className="opacity-80 transition-all duration-300"
                />
              )}

              {/* Views Stroke Line */}
              {viewsPath && (
                <path
                  d={viewsPath}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-all duration-300 drop-shadow-sm"
                />
              )}

              {/* Active Hover Crosshair Line & Points */}
              {activeCoord && (
                <g className="transition-all duration-150">
                  <line
                    x1={activeCoord.x}
                    y1={paddingY}
                    x2={activeCoord.x}
                    y2={chartHeight - paddingY}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    className="opacity-60"
                  />
                  {/* Views circle */}
                  <circle
                    cx={activeCoord.x}
                    cy={activeCoord.y}
                    r="5"
                    className="fill-[var(--accent)] stroke-[var(--surface)] stroke-2 shadow-md"
                  />
                  {/* Uniques circle */}
                  <circle
                    cx={activeCoord.x}
                    cy={activeCoord.uniqueY}
                    r="4"
                    className="fill-sky-400 stroke-[var(--surface)] stroke-2"
                  />
                </g>
              )}

              {/* Transparent Hit-test Columns for Smooth Hover */}
              {svgCoordinates.map((c, idx) => {
                const colWidth = drawableWidth / Math.max(svgCoordinates.length, 1);
                return (
                  <rect
                    key={idx}
                    x={c.x - colWidth / 2}
                    y={0}
                    width={colWidth}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverIndex(idx)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Bottom Date Axis Markers */}
          <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)] pt-1 px-1 border-t border-[var(--border)]/50">
            <span>{points[0]?.label}</span>
            {timeframe === 30 && (
              <>
                <span className="hidden sm:inline">{points[Math.floor(points.length / 3)]?.label}</span>
                <span className="hidden sm:inline">{points[Math.floor((points.length / 3) * 2)]?.label}</span>
              </>
            )}
            {timeframe === 7 && (
              <span className="hidden sm:inline">{points[Math.floor(points.length / 2)]?.label}</span>
            )}
            <span>{points[points.length - 1]?.label}</span>
          </div>
        </div>

        {/* Right Side Breakdown: Top Pages & Referrers (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top Visited Pages */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text)] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
                Top Visited Pages
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Views</span>
            </div>

            <div className="space-y-2.5">
              {summary.topPages.map((page, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[var(--text)] truncate max-w-[170px]" title={page.path}>
                      {page.path === "/" ? "/ (Homepage)" : page.path}
                    </span>
                    <span className="font-mono text-[var(--text-muted)] font-semibold">
                      {page.views} <span className="text-[10px] opacity-70">({page.percentage}%)</span>
                    </span>
                  </div>
                  {/* Progress Meter */}
                  <div className="h-1.5 w-full bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border)]/60">
                    <div
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(page.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Referral Sources */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text)] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                Acquisition Channels
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Shares</span>
            </div>

            <div className="space-y-2.5">
              {summary.topReferrers.map((ref, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--text)] truncate max-w-[170px]">
                      {ref.source}
                    </span>
                    <span className="font-mono text-[var(--text-muted)] font-semibold">
                      {ref.count} <span className="text-[10px] opacity-70">({ref.percentage}%)</span>
                    </span>
                  </div>
                  {/* Progress Meter */}
                  <div className="h-1.5 w-full bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border)]/60">
                    <div
                      className="h-full bg-sky-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(ref.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

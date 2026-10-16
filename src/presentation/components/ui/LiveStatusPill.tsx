"use client";

import React, { useEffect, useState } from "react";
import { Clock, Info } from "lucide-react";

export interface LiveStatusPillProps {
  availability: string;
  isAvailable?: boolean;
  localTimeLabel?: string;
  activeHoursLabel?: string;
  className?: string;
}

export const LiveStatusPill: React.FC<LiveStatusPillProps> = ({
  availability,
  isAvailable = true,
  localTimeLabel = "Jakarta (WIB · GMT+7)",
  activeHoursLabel = "Active 09:00 - 18:00 WIB · Responds within 24h",
  className = "",
}) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Jakarta time format (GMT+7 / Asia/Jakarta)
      const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setCurrentTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setShowDetails((prev) => !prev)}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
        aria-expanded={showDetails}
        aria-label={`${availability}. Current time in ${localTimeLabel} is ${currentTime || "loading"}`}
        className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text)] shadow-xs transition-all duration-200 hover:border-[var(--accent)]/60 hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] cursor-pointer"
      >
        {/* Pulsing indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isAvailable ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isAvailable ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
        </span>

        {/* Availability status */}
        <span className="font-medium">{availability}</span>

        {/* Divider dot */}
        <span className="h-1 w-1 rounded-full bg-[var(--border)]" aria-hidden="true" />

        {/* Live Clock (Client hydrated) */}
        <span className="flex items-center gap-1 text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors font-mono tabular-nums">
          <Clock className="w-3 h-3 text-[var(--accent)]" />
          <span>{currentTime || "--:--:--"}</span>
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-sans">
            WIB
          </span>
        </span>
      </button>

      {/* Tactile Popover with timezone context */}
      {showDetails && (
        <div
          role="tooltip"
          className="absolute left-0 top-full mt-2 z-50 w-72 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md shadow-xl text-xs text-[var(--text)] transition-all animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-[var(--text)]">
                {localTimeLabel}
              </div>
              <div className="text-[var(--text-muted)] leading-relaxed">
                {activeHoursLabel}
              </div>
              <div
                className={`pt-1 text-[11px] font-medium ${
                  isAvailable ? "text-emerald-500" : "text-amber-500"
                }`}
              >
                {availability}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

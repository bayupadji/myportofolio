"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const AnalyticsTracker: React.FC = () => {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    try {
      const payload = JSON.stringify({
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer : null,
      });

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/hit", blob);
      } else {
        fetch("/api/analytics/hit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking telemetry
    }
  }, [pathname]);

  return null;
};

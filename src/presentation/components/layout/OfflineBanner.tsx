"use client";

import React, { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";
import { Messages } from "@/presentation/i18n";

export interface OfflineBannerProps {
  messages: Messages;
}

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ messages }) => {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (isOnline) return null;

  return (
    <div
      role="status"
      data-testid="offline-banner"
      aria-live="polite"
      className="w-full bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs font-medium flex items-center justify-center gap-2"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>{messages.common.offlineNotice}</span>
    </div>
  );
};

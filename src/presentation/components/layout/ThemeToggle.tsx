"use client";

import React, { useSyncExternalStore } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useUiStore, ThemePreference } from "@/presentation/stores/useUiStore";

function applyTheme(pref: ThemePreference) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (pref === "dark") {
    root.classList.add("dark");
  } else if (pref === "light") {
    root.classList.remove("dark");
  } else {
    // system
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

const emptySubscribe = () => () => {};

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useUiStore();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const cycleTheme = () => {
    let next: ThemePreference = "light";
    if (theme === "system") next = "light";
    else if (theme === "light") next = "dark";
    else if (theme === "dark") next = "system";

    setTheme(next);
    localStorage.setItem("theme-preference", next);
    applyTheme(next);
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-[16px] bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2.5 rounded-[16px] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 flex items-center justify-center min-w-[44px] min-h-[44px]"
      aria-label={`Current theme: ${theme}. Click to change theme.`}
      title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
    >
      {theme === "light" && <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200" />}
      {theme === "dark" && <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-200" />}
      {theme === "system" && <Laptop className="w-4 h-4 text-[var(--text-muted)] transition-transform duration-200" />}
    </button>
  );
};

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

export interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
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

  const defaultClasses =
    "h-9 w-9 flex-none rounded-full border border-[var(--border)]/70 bg-[var(--surface)]/40 hover:bg-[var(--surface)]/70 hover:border-[var(--accent)] text-[var(--text)] transition-all duration-300 hover:rotate-[20deg] flex items-center justify-center cursor-pointer shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 shrink-0 backdrop-blur-sm";

  if (!mounted) {
    return (
      <div
        className={
          className || "w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] animate-pulse shrink-0"
        }
      />
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className={className || defaultClasses}
      aria-label={`Current theme: ${theme}. Click to change theme.`}
      title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
    >
      {theme === "light" && <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200" />}
      {theme === "dark" && <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-200" />}
      {theme === "system" && <Laptop className="w-4 h-4 text-[var(--text-muted)] transition-transform duration-200" />}
    </button>
  );
};


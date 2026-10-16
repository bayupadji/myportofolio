"use client";

import React, { useEffect } from "react";
import { create } from "zustand";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = {
      ...toast,
      id,
      duration: toast.duration ?? (toast.type === "error" ? 5000 : 4000),
    };

    set((state) => ({
      // Keep at most 4 toasts visible at once, appending newest at bottom
      toasts: [...state.toasts.slice(-3), newToast],
    }));

    return id;
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

export const toast = {
  success: (message: string, title?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: "success", message, title, duration }),
  error: (message: string, title?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: "error", message, title, duration }),
  info: (message: string, title?: string, duration?: number) =>
    useToastStore.getState().addToast({ type: "info", message, title, duration }),
  dismiss: (id: string) => useToastStore.getState().dismissToast(id),
};

const ToastCard: React.FC<{
  item: ToastItem;
  onDismiss: (id: string) => void;
}> = ({ item, onDismiss }) => {
  useEffect(() => {
    if (!item.duration || item.duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(item.id);
    }, item.duration);

    return () => clearTimeout(timer);
  }, [item.id, item.duration, onDismiss]);

  const config = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />,
      border: "border-[var(--border)] border-l-4 border-l-[var(--success)]",
      badge: "bg-[var(--success)]/10 text-[var(--success)]",
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-[var(--error)] shrink-0 mt-0.5" />,
      border: "border-[var(--border)] border-l-4 border-l-[var(--error)]",
      badge: "bg-[var(--error)]/10 text-[var(--error)]",
    },
    info: {
      icon: <Info className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />,
      border: "border-[var(--border)] border-l-4 border-l-[var(--accent)]",
      badge: "bg-[var(--accent)]/10 text-[var(--accent)]",
    },
  }[item.type];

  return (
    <div
      role={item.type === "error" ? "alert" : "status"}
      aria-live={item.type === "error" ? "assertive" : "polite"}
      className={`pointer-events-auto flex items-start gap-3 w-full p-4 rounded-xl bg-[var(--surface)] text-[var(--text)] shadow-lg shadow-black/5 dark:shadow-black/30 border transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${config.border}`}
    >
      {config.icon}

      <div className="flex-1 min-w-0 pr-1">
        {item.title && (
          <h4 className="text-xs font-bold tracking-tight text-[var(--text)] mb-0.5">
            {item.title}
          </h4>
        )}
        <p className="text-xs text-[var(--text-muted)] leading-relaxed break-words">
          {item.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const Toaster: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[9999] pointer-events-none flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] sm:w-96"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={dismissToast} />
      ))}
    </aside>
  );
};

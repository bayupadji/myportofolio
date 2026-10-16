"use client";

import React, { useEffect, useRef } from "react";
import { useUiStore } from "@/presentation/stores/useUiStore";
import { X } from "lucide-react";

export const Lightbox: React.FC = () => {
  const { activeLightbox, closeLightbox } = useUiStore();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (activeLightbox) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      closeBtnRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeLightbox();
        } else if (e.key === "Tab") {
          e.preventDefault();
          closeBtnRef.current?.focus();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        previousActiveElementRef.current?.focus();
      };
    }
  }, [activeLightbox, closeLightbox]);

  if (!activeLightbox) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged image view"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={closeLightbox}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          onClick={closeLightbox}
          className="absolute -top-12 right-0 p-2.5 rounded-[16px] bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-white"
          aria-label="Close enlarged view"
        >
          <X className="w-6 h-6" />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeLightbox.url}
          alt={activeLightbox.alt}
          className="max-h-[80vh] w-auto max-w-full rounded-lg shadow-2xl object-contain border border-white/10"
        />

        {activeLightbox.caption && (
          <p className="mt-3 text-sm text-slate-300 text-center max-w-xl">
            {activeLightbox.caption}
          </p>
        )}
      </div>
    </div>
  );
};

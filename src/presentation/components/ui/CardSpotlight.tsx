"use client";

import React, { useState, useRef, MouseEvent } from "react";

export interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
}

/**
 * Interactive cursor-following spotlight wrapper with primary color gradient glow.
 * Dynamically highlights card surface and border using the primary brand accent gradient.
 */
export const CardSpotlight: React.FC<CardSpotlightProps> = ({
  children,
  className = "",
  size = 280,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Card Content */}
      <div className="relative z-1 flex flex-col flex-1 h-full w-full">
        {children}
      </div>

      {/* 1. Focused Gradient Primary Color Spotlight (Surface Glow overlay) */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-[inherit] z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, color-mix(in srgb, var(--accent) 20%, transparent) 0%, color-mix(in srgb, var(--accent-hover, var(--accent)) 8%, transparent) 32%, transparent 58%)`,
        }}
        aria-hidden="true"
      />

      {/* 2. Focused Dynamic Border Illumination (Border Glow) */}
      <div
        className="pointer-events-none absolute -inset-[1px] transition-opacity duration-300 rounded-[inherit] z-20"
        style={{
          opacity: isHovered ? 0.9 : 0,
          background: `radial-gradient(${size * 0.8}px circle at ${position.x}px ${position.y}px, var(--accent), transparent 58%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
        aria-hidden="true"
      />
    </div>
  );
};

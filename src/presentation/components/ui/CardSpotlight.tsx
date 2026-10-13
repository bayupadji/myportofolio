"use client";

import React, { useState, useRef, MouseEvent } from "react";

export interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const CardSpotlight: React.FC<CardSpotlightProps> = ({
  children,
  className = "",
  spotlightColor = "var(--accent)",
}) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setPosition(null);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Subtle cursor-following spotlight glow */}
      {position && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100 rounded-[inherit]"
          style={{
            background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}18, transparent 75%)`,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
};

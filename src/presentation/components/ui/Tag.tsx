import React from "react";

export interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "warning" | "success";
  size?: "sm" | "md";
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) => {
  const sizeClasses = {
    sm: "text-xs px-2.5 py-1 rounded-md font-medium",
    md: "text-sm px-3 py-1.5 rounded-lg font-medium",
  };

  const variantClasses = {
    default:
      "bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)]",
    accent:
      "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/25",
    warning:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25",
    success:
      "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/25",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 leading-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

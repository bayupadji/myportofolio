import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-[0.98]";

  const sizeClasses = {
    sm: "text-sm px-3.5 py-2 min-h-[40px] gap-1.5",
    md: "text-base px-5 py-2.5 min-h-[44px] gap-2", // min 44px touch target WCAG
    lg: "text-lg px-6 py-3 min-h-[50px] gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 shadow-sm shadow-[var(--accent)]/15",
    secondary:
      "bg-[var(--surface-hover)] text-[var(--text)] hover:bg-[var(--border)] border border-[var(--border)]",
    outline:
      "border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-transparent",
    ghost:
      "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]",
  };

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

import React from "react";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "primary" | "purple";
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  className = "",
  size = "md",
}) => {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-semibold";

  const variantClasses = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200",
    primary: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};

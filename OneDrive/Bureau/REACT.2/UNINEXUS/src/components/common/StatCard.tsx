import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "indigo" | "emerald" | "sky" | "amber" | "rose" | "purple";
  subtitle?: string;
  badge?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = "indigo",
  subtitle,
  badge,
  trend,
  onClick,
}) => {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
      ring: "group-hover:ring-indigo-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      ring: "group-hover:ring-emerald-100",
    },
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-100",
      ring: "group-hover:ring-sky-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
      ring: "group-hover:ring-amber-100",
    },
    rose: {
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
      ring: "group-hover:ring-rose-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
      ring: "group-hover:ring-purple-100",
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {value}
            </h3>
            {badge && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-medium">
              <span
                className={trend.isPositive ? "text-emerald-600" : "text-rose-600"}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}
              </span>
              <span className="text-slate-400">vs last semester</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${scheme.bg} ${scheme.text} transition-transform group-hover:scale-105`}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

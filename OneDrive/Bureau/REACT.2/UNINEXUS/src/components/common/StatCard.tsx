import React from "react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "indigo" | "emerald" | "sky" | "amber" | "rose" | "purple" | "violet";
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
    const { isDark } = useTheme();

  const colorMap = {
    indigo: {
      bg: "bg-gradient-to-br from-[#4f46e5] to-[#4338ca] shadow-md shadow-indigo-500/25",
      text: "text-white",
      border: "border-indigo-100 dark:border-indigo-900/50",
      hoverBorder: isDark ? "hover:border-indigo-500/50 hover:shadow-indigo-500/10" : "hover:border-indigo-300 hover:shadow-indigo-500/10",
    },
    emerald: {
      bg: isDark ? "bg-emerald-900/30" : "bg-emerald-50",
      text: "text-emerald-500 dark:text-emerald-400",
      border: "border-emerald-100 dark:border-emerald-900/50",
      hoverBorder: isDark ? "hover:border-slate-700" : "hover:border-slate-300",
    },
    sky: {
      bg: isDark ? "bg-sky-900/30" : "bg-sky-50",
      text: "text-sky-500 dark:text-sky-400",
      border: "border-sky-100 dark:border-sky-900/50",
      hoverBorder: isDark ? "hover:border-slate-700" : "hover:border-slate-300",
    },
    amber: {
      bg: isDark ? "bg-amber-900/30" : "bg-amber-50",
      text: "text-amber-500 dark:text-amber-400",
      border: "border-amber-100 dark:border-amber-900/50",
      hoverBorder: isDark ? "hover:border-slate-700" : "hover:border-slate-300",
    },
    rose: {
      bg: isDark ? "bg-rose-900/30" : "bg-rose-50",
      text: "text-rose-500 dark:text-rose-400",
      border: "border-rose-100 dark:border-rose-900/50",
      hoverBorder: isDark ? "hover:border-slate-700" : "hover:border-slate-300",
    },
    purple: {
      bg: "bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-purple-500/25",
      text: "text-white",
      border: "border-purple-100 dark:border-purple-900/50",
      hoverBorder: isDark ? "hover:border-purple-500/50 hover:shadow-purple-500/10" : "hover:border-purple-300 hover:shadow-purple-500/10",
    },
    violet: {
      bg: "bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] shadow-md shadow-indigo-500/25",
      text: "text-white",
      border: "border-purple-100 dark:border-purple-900/50",
      hoverBorder: isDark ? "hover:border-indigo-500/50 hover:shadow-indigo-500/10" : "hover:border-indigo-300 hover:shadow-indigo-500/10",
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`group rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all duration-200 ${
        isDark
          ? `bg-slate-900 border-slate-800 ${scheme.hoverBorder}`
          : `bg-white border-slate-200/80 ${scheme.hoverBorder}`
      } ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-wider truncate ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}>
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              {value}
            </h3>
            {badge && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isDark
                  ? "bg-slate-700 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className={`text-xs mt-1 truncate ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-medium">
              <span
                className={trend.isPositive ? "text-emerald-600" : "text-rose-600"}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}
              </span>
              <span className={isDark ? "text-slate-500" : "text-slate-400"}>vs last semester</span>
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

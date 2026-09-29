import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { NotificationDropdown } from "../common/NotificationDropdown";
import { getUserAvatar } from "../../utils/avatar";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Award,
  Megaphone,
  Settings,
  LogOut,
  FileCheck,
  GraduationCap,
  Bell,
  Search,
  Menu,
  X,
  ArrowRight,
  ShieldAlert,
  Sun,
  Moon,
  Globe,
  Check,
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, role, logout } = useAuth();
  const {
    notifications,
    justifications,
    courses,
    users,
    timetableSlots,
    marks,
    announcements,
    emergencyReports,
  } = useData();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadNotifications = notifications.filter(
    (n) =>
      (!n.targetRole || n.targetRole === "all" || n.targetRole === role) &&
      !n.isRead
  ).length;

  // Pending justifications badge count
  const pendingJustificationsCount = useMemo(() => {
    if (role === "admin") {
      return justifications.filter((j) => j.status === "PENDING").length;
    }
    if (role === "teacher") {
      const teacherId = user?.id;
      return justifications.filter(
        (j) =>
          j.status === "PENDING" &&
          (j.lecturerId === teacherId || j.lecturerName.includes(user?.name?.split(" ")[1] || "Smith"))
      ).length;
    }
    return 0;
  }, [justifications, role, user]);

  const activeEmergencies = useMemo(() => {
    return (emergencyReports || []).filter(
      (r) => r.status === "Reported" || r.status === "Dispatched"
    );
  }, [emergencyReports]);

  // Define Navigation Items strictly adhering to Requirements
  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [
          { label: t("nav.dashboard", "Dashboard"), path: "/admin/dashboard", icon: LayoutDashboard },
          { label: t("nav.user_management", "User Management"), path: "/admin/users", icon: Users },
          { label: t("nav.timetable_management", "Timetable Management"), path: "/admin/timetable", icon: Calendar },
          {
            label: t("nav.absence_justifications", "Absence Justifications"),
            path: "/admin/absences",
            icon: FileCheck,
            badge: pendingJustificationsCount > 0 ? String(pendingJustificationsCount) : undefined,
          },
          { label: t("nav.announcements", "Announcements"), path: "/admin/announcements", icon: Megaphone },
          { label: t("nav.settings", "Settings"), path: "/admin/settings", icon: Settings },
        ];

      case "teacher":
        return [
          { label: t("nav.dashboard", "Dashboard"), path: "/teacher/dashboard", icon: LayoutDashboard },
          { label: t("nav.class_timetable", "Class Timetable"), path: "/teacher/timetable", icon: Calendar },
          { label: t("nav.submit_availability", "Submit Availability"), path: "/teacher/availability", icon: CalendarClock },
          { label: t("nav.attendance", "Attendance"), path: "/teacher/attendance", icon: CalendarCheck },
          {
            label: t("nav.absence_justifications", "Absence Justifications"),
            path: "/teacher/absences",
            icon: FileCheck,
            badge: pendingJustificationsCount > 0 ? String(pendingJustificationsCount) : undefined,
          },
          { label: t("nav.marks_management", "Marks Management"), path: "/teacher/marks", icon: Award },
          { label: t("nav.settings", "Settings"), path: "/teacher/settings", icon: Settings },
        ];

      case "student":
      default:
        return [
          { label: t("nav.dashboard", "Dashboard"), path: "/student/dashboard", icon: LayoutDashboard },
          { label: t("nav.my_timetable", "My Timetable"), path: "/student/timetable", icon: Calendar },
          { label: t("nav.my_attendance", "My Attendance"), path: "/student/attendance", icon: CalendarCheck },
          { label: t("nav.my_marks", "My Marks"), path: "/student/results", icon: Award },
          { label: t("nav.settings", "Settings"), path: "/student/settings", icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  // Role-specific theme colors - unified to rich purple / indigo matching login & registration
  const themeConfig = {
    admin: {
      sidebarBg: isDark ? "bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-[#1e1b4b] border-r border-indigo-950/80" : "bg-gradient-to-b from-[#4f46e5] via-[#4338ca] to-[#3730a3]",
      activeBg: isDark ? "bg-gradient-to-r from-indigo-600/40 to-purple-600/30 text-white font-semibold border-l-4 border-indigo-400 shadow-xs" : "bg-white/20 text-white font-semibold shadow-xs",
      hoverBg: isDark ? "hover:bg-indigo-950/60 text-indigo-200/70 hover:text-white" : "hover:bg-white/10 text-indigo-100 hover:text-white",
      badgeColor: "bg-indigo-900/60 text-indigo-100",
      accent: "text-indigo-600",
      title: t("role.admin", "ADMINISTRATOR"),
    },
    teacher: {
      sidebarBg: isDark ? "bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-[#1e1b4b] border-r border-indigo-950/80" : "bg-gradient-to-b from-[#4f46e5] via-[#4338ca] to-[#3730a3]",
      activeBg: isDark ? "bg-gradient-to-r from-indigo-600/40 to-purple-600/30 text-white font-semibold border-l-4 border-indigo-400 shadow-xs" : "bg-white/20 text-white font-semibold shadow-xs",
      hoverBg: isDark ? "hover:bg-indigo-950/60 text-indigo-200/70 hover:text-white" : "hover:bg-white/10 text-indigo-100 hover:text-white",
      badgeColor: "bg-indigo-900/60 text-indigo-100",
      accent: "text-indigo-600",
      title: t("role.teacher", "FACULTY"),
    },
    student: {
      sidebarBg: isDark ? "bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-[#1e1b4b] border-r border-indigo-950/80" : "bg-gradient-to-b from-[#4f46e5] via-[#4338ca] to-[#3730a3]",
      activeBg: isDark ? "bg-gradient-to-r from-indigo-600/40 to-purple-600/30 text-white font-semibold border-l-4 border-indigo-400 shadow-xs" : "bg-white/20 text-white font-semibold shadow-xs",
      hoverBg: isDark ? "hover:bg-indigo-950/60 text-indigo-200/70 hover:text-white" : "hover:bg-white/10 text-indigo-100 hover:text-white",
      badgeColor: "bg-indigo-900/60 text-indigo-100",
      accent: "text-indigo-600",
      title: t("role.student", "STUDENT"),
    },
  }[role];

  // Functional Role-Based Search Results (strictly isolated per role)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: { title: string; subtitle: string; category: string; url: string }[] = [];

    if (role === "student") {
      // Search timetable
      timetableSlots
        .filter((t) => t.courseTitle.toLowerCase().includes(q) || (t.courseCode && t.courseCode.toLowerCase().includes(q)))
        .slice(0, 3)
        .forEach((t) => {
          results.push({
            title: t.courseCode ? `${t.courseCode} - ${t.courseTitle}` : t.courseTitle,
            subtitle: `${t.day} at ${t.startTime} in ${t.classroom}`,
            category: "Timetable",
            url: "/student/timetable",
          });
        });

      // Search marks
      marks
        .filter((m) => m.studentId === user?.id && (m.courseTitle.toLowerCase().includes(q) || m.courseCode.toLowerCase().includes(q)))
        .slice(0, 2)
        .forEach((m) => {
          results.push({
            title: `${m.courseCode}: Grade ${m.grade} (${m.totalMark}%)`,
            subtitle: m.courseTitle,
            category: "My Marks",
            url: "/student/results",
          });
        });

      // Search announcements
      announcements
        .filter((a) => a.title.toLowerCase().includes(q) || (a.description || a.content || "").toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((a) => {
          results.push({
            title: a.title,
            subtitle: a.date,
            category: "Announcements",
            url: "/student/announcements",
          });
        });
    } else if (role === "teacher") {
      // Search students
      users
        .filter((u) => u.role === "student" && (u.name.toLowerCase().includes(q) || u.identifier.toLowerCase().includes(q)))
        .slice(0, 3)
        .forEach((s) => {
          results.push({
            title: s.name,
            subtitle: `ID: ${s.identifier} | ${s.department}`,
            category: "Students",
            url: "/teacher/students",
          });
        });

      // Search justifications
      justifications
        .filter((j) => j.studentName.toLowerCase().includes(q) || j.courseCode.toLowerCase().includes(q) || j.reason.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((j) => {
          results.push({
            title: `${j.studentName} - ${j.courseCode} (${j.status})`,
            subtitle: j.reason,
            category: "Absence Justifications",
            url: "/teacher/absences",
          });
        });

      // Search courses
      courses
        .filter((c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
        .slice(0, 2)
        .forEach((c) => {
          results.push({
            title: `${c.code} - ${c.title}`,
            subtitle: `${c.scheduleDays} ${c.scheduleTime}`,
            category: "Courses",
            url: "/teacher/attendance",
          });
        });
    } else if (role === "admin") {
      // Search all users
      users
        .filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.identifier.toLowerCase().includes(q))
        .slice(0, 4)
        .forEach((u) => {
          results.push({
            title: `${u.name} (${u.role.toUpperCase()})`,
            subtitle: `${u.email} • ${u.identifier}`,
            category: "User Management",
            url: "/admin/users",
          });
        });

      // Search justifications
      justifications
        .filter((j) => j.studentName.toLowerCase().includes(q) || j.courseCode.toLowerCase().includes(q) || j.reason.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((j) => {
          results.push({
            title: `Justification: ${j.studentName} (${j.status})`,
            subtitle: `${j.courseCode} on ${j.absenceDate} - ${j.reason.slice(0, 35)}...`,
            category: "Absences",
            url: "/admin/absences",
          });
        });
    }

    return results;
  }, [searchQuery, role, user, timetableSlots, marks, announcements, users, justifications, courses]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`min-h-screen ${isDark ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} flex transition-colors duration-200`}>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`hidden lg:flex flex-col w-64 ${themeConfig.sidebarBg} text-white shrink-0 shadow-xl transition-all duration-300 z-30`}
      >
        {/* Brand / Role Header */}
        <div className={`p-6 border-b ${isDark ? "border-slate-800" : "border-white/10"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
              <GraduationCap size={24} />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight block">
                UNISPHERE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/70 block">
                {themeConfig.title}
              </span>
            </div>
          </div>

          {/* User badge */}
          <div className={`mt-4 p-2.5 rounded-xl ${isDark ? "bg-slate-900/80 border border-slate-800" : "bg-black/15"} flex items-center gap-3`}>
            <img
              src={getUserAvatar(user, role)}
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/30 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || "Campus User"}
              </p>
              <p className="text-[11px] text-white/70 truncate">
                {user?.identifier || user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 group ${
                  isActive ? themeConfig.activeBg : themeConfig.hoverBg
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={19}
                    className={`shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "opacity-80"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Logout Footer (Strictly isolated, NO Switch View) */}
        <div className={`p-3 border-t ${isDark ? "border-slate-800" : "border-white/10"}`}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-red-200 hover:text-white hover:bg-red-500/30 transition font-medium"
          >
            <LogOut size={18} />
            <span>{t("nav.sign_out", "Sign Out")}</span>
          </button>
        </div>
      </aside>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={`relative w-72 ${themeConfig.sidebarBg} text-white flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200`}
          >
            <div className={`p-5 border-b ${isDark ? "border-slate-800" : "border-white/10"} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <GraduationCap size={22} />
                </div>
                <span className="font-black text-lg">UNISPHERE</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm ${
                      isActive ? themeConfig.activeBg : themeConfig.hoverBg
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className={`p-4 border-t ${isDark ? "border-slate-800" : "border-white/10"}`}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-200 hover:text-white"
              >
                <LogOut size={16} />
                <span>{t("nav.sign_out", "Sign Out")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className={`h-16 ${isDark ? "bg-slate-900/90 border-slate-800 text-slate-100" : "bg-white border-slate-200/80 text-slate-900"} border-b px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs backdrop-blur-md transition-colors duration-200`}>
          {/* Left: Mobile hamburger & breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden w-9 h-9 rounded-xl border ${isDark ? "border-slate-800 bg-slate-800/80 text-slate-300" : "border-slate-200 bg-white text-slate-600"} flex items-center justify-center hover:opacity-80`}
            >
              <Menu size={20} />
            </button>
            <div className={`hidden sm:flex items-center gap-2 text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <span className="capitalize">{t(`portal.${role}`, `${role} Portal`)}</span>
              <span>/</span>
              <span className={`font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                {navItems.find((i) => location.pathname.startsWith(i.path))
                  ?.label || "Dashboard"}
              </span>
            </div>
          </div>

          {/* Center: Global Role-Aware Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder={
                  role === "student"
                    ? t("header.search_student", "Search timetable, marks, announcements...")
                    : role === "teacher"
                    ? t("header.search_teacher", "Search students, absences, courses...")
                    : t("header.search_admin", "Search users, absences, records...")
                }
                className={`w-full pl-9 pr-4 py-2 ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:bg-slate-900 focus:border-indigo-500"
                    : "bg-slate-100/80 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500"
                } border rounded-xl text-xs sm:text-sm outline-none transition focus:ring-4 focus:ring-indigo-500/10`}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchOpen && searchQuery.trim().length > 0 && (
              <div
                className={`absolute top-full left-0 right-0 mt-2 ${
                  isDark ? "bg-slate-900 border-slate-800 text-slate-100 shadow-2xl" : "bg-white border-slate-200 text-slate-900 shadow-xl"
                } border rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 max-h-96 overflow-y-auto`}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Search Results for "{searchQuery}"
                </div>
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No authorized records found matching your query.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          navigate(item.url);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between group ${
                          isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold truncate">{item.title}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              isDark ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-50 text-indigo-700"
                            }`}>
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                        <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SOS Incident Active Badge */}
            {activeEmergencies.length > 0 && (
              <Link
                to={role === "admin" ? "/admin/emergency" : "/student/emergency"}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition animate-pulse"
                title={`${activeEmergencies.length} Active Emergency Incident(s)`}
              >
                <ShieldAlert size={15} />
                <span className="hidden sm:inline">{t("header.sos_active", "SOS Active")} ({activeEmergencies.length})</span>
              </Link>
            )}

            {/* 1. Language Selector Button & Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`h-9 px-2.5 rounded-xl border flex items-center gap-1.5 transition text-xs font-bold ${
                  isDark
                    ? "border-slate-800 bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:border-slate-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                } shadow-2xs`}
                title={language === "en" ? t("header.language_to_fr", "Switch to French (FR)") : t("header.language_to_en", "Switch to English (EN)")}
                aria-label={language === "en" ? "Switch to French" : "Switch to English"}
              >
                <Globe size={15} className="text-indigo-500 shrink-0" />
                <span className="uppercase tracking-wider">{language === "en" ? "EN" : "FR"}</span>
                <span className="text-[13px]">{language === "en" ? "🇬🇧" : "🇫🇷"}</span>
              </button>

              {langMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-44 rounded-2xl border p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 ${
                    isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t("header.language", "Language")}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage("en");
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      language === "en"
                        ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🇬🇧</span>
                      <span>English</span>
                    </span>
                    {language === "en" && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLanguage("fr");
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      language === "fr"
                        ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🇫🇷</span>
                      <span>Français</span>
                    </span>
                    {language === "fr" && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* 2. Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                isDark
                  ? "border-slate-800 bg-slate-800 text-amber-400 hover:bg-slate-700 hover:text-amber-300 shadow-2xs"
                  : "border-slate-200 bg-white text-indigo-600 hover:bg-slate-50 hover:text-indigo-700 shadow-2xs"
              }`}
              title={isDark ? t("header.theme_to_light", "Switch to Light Mode") : t("header.theme_to_dark", "Switch to Dark Mode")}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun size={18} className="transition-transform hover:rotate-45" />
              ) : (
                <Moon size={18} className="transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition relative ${
                  isDark
                    ? "border-slate-800 bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
                title={t("header.notifications", "Notifications")}
              >
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              <NotificationDropdown
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
              />
            </div>

            {/* Profile Avatar -> Links to Settings/Profile */}
            <Link
              to={`/${role}/settings`}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 group"
              title={t("header.profile_settings", "View Profile & Settings")}
            >
              <img
                src={getUserAvatar(user, role)}
                alt={user?.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition"
              />
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} transition-colors duration-200`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { NotificationDropdown } from "../common/NotificationDropdown";
import { EmergencyModal } from "../common/EmergencyModal";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarCheck,
  Award,
  Megaphone,
  ShieldAlert,
  Settings,
  LogOut,
  MessageSquare,
  FileEdit,
  FileCheck,
  GraduationCap,
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, role, logout } = useAuth();
  const {
    notifications,
    emergencyReports,
    justifications,
    courses,
    users,
    timetableSlots,
    marks,
    announcements,
  } = useData();
  const { theme, isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadNotifications = notifications.filter(
    (n) =>
      (!n.targetRole || n.targetRole === "all" || n.targetRole === role) &&
      !n.isRead
  ).length;

  const activeEmergencies = emergencyReports.filter(
    (e) => e.status === "Reported" || e.status === "Dispatched"
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

  // Define Navigation Items strictly adhering to Requirements #1, #13, #14
  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [
          { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
          { label: "User Management", path: "/admin/users", icon: Users },
          { label: "Timetable Management", path: "/admin/timetable", icon: Calendar },
          { label: "Results Management", path: "/admin/results", icon: Award },
          {
            label: "Absence Justifications",
            path: "/admin/absences",
            icon: FileCheck,
            badge: pendingJustificationsCount > 0 ? String(pendingJustificationsCount) : undefined,
          },
          { label: "Announcements", path: "/admin/announcements", icon: Megaphone },
          {
            label: "Emergency Reports",
            path: "/admin/emergency",
            icon: ShieldAlert,
            badge: activeEmergencies > 0 ? String(activeEmergencies) : undefined,
          },
          { label: "Settings", path: "/admin/settings", icon: Settings },
        ];

      case "teacher":
        return [
          { label: "Dashboard", path: "/teacher/dashboard", icon: LayoutDashboard },
          { label: "Attendance", path: "/teacher/attendance", icon: CalendarCheck },
          {
            label: "Absence Justifications",
            path: "/teacher/absences",
            icon: FileCheck,
            badge: pendingJustificationsCount > 0 ? String(pendingJustificationsCount) : undefined,
          },
          { label: "Marks Management", path: "/teacher/marks", icon: Award },
          { label: "Students", path: "/teacher/students", icon: Users },
          { label: "Assignments", path: "/teacher/assignments", icon: FileEdit },
          { label: "Announcements", path: "/teacher/announcements", icon: Megaphone },
          { label: "Settings", path: "/teacher/settings", icon: Settings },
        ];

      case "student":
      default:
        return [
          { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
          { label: "My Timetable", path: "/student/timetable", icon: Calendar },
          { label: "Absences & Justifications", path: "/student/absences", icon: FileCheck },
          { label: "My Marks", path: "/student/results", icon: Award },
          { label: "Announcements", path: "/student/announcements", icon: Megaphone },
          { label: "Community Chat", path: "/student/chat", icon: MessageSquare },
          { label: "Emergency Report", path: "/student/emergency", icon: ShieldAlert },
          { label: "Settings", path: "/student/settings", icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  // Role-specific theme colors
  const themeConfig = {
    admin: {
      sidebarBg: isDark ? "bg-slate-950 border-r border-slate-800" : "bg-[#4338ca]",
      activeBg: isDark ? "bg-indigo-600/30 text-indigo-200 font-semibold border-l-4 border-indigo-400" : "bg-white/20 text-white font-semibold",
      hoverBg: isDark ? "hover:bg-slate-900 text-slate-400 hover:text-slate-200" : "hover:bg-white/10 text-indigo-100 hover:text-white",
      badgeColor: "bg-indigo-900/60 text-indigo-100",
      accent: "text-indigo-600",
      title: "ADMINISTRATOR",
    },
    teacher: {
      sidebarBg: isDark ? "bg-slate-950 border-r border-slate-800" : "bg-[#0284c7]",
      activeBg: isDark ? "bg-sky-600/30 text-sky-200 font-semibold border-l-4 border-sky-400" : "bg-white/20 text-white font-semibold",
      hoverBg: isDark ? "hover:bg-slate-900 text-slate-400 hover:text-slate-200" : "hover:bg-white/10 text-sky-100 hover:text-white",
      badgeColor: "bg-sky-900/60 text-sky-100",
      accent: "text-sky-600",
      title: "TEACHER",
    },
    student: {
      sidebarBg: isDark ? "bg-slate-950 border-r border-slate-800" : "bg-[#059669]",
      activeBg: isDark ? "bg-emerald-600/30 text-emerald-200 font-semibold border-l-4 border-emerald-400" : "bg-white/20 text-white font-semibold",
      hoverBg: isDark ? "hover:bg-slate-900 text-slate-400 hover:text-slate-200" : "hover:bg-white/10 text-emerald-100 hover:text-white",
      badgeColor: "bg-emerald-900/60 text-emerald-100",
      accent: "text-emerald-600",
      title: "STUDENT",
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
        .filter((t) => t.courseTitle.toLowerCase().includes(q) || t.courseCode.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((t) => {
          results.push({
            title: `${t.courseCode} - ${t.courseTitle}`,
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
        .filter((a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q))
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
              <span className="font-bold text-lg tracking-tight block">
                UniNexus
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/70 block">
                {themeConfig.title}
              </span>
            </div>
          </div>

          {/* User badge */}
          <div className={`mt-4 p-2.5 rounded-xl ${isDark ? "bg-slate-900/80 border border-slate-800" : "bg-black/15"} flex items-center gap-3`}>
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
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
            <span>Sign Out</span>
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
                <span className="font-bold text-lg">UniNexus</span>
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
                <span>Sign Out</span>
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
              <span className="capitalize">{role} Portal</span>
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
                placeholder={`Search ${role === "student" ? "timetable, marks, announcements..." : role === "teacher" ? "students, absences, courses..." : "users, absences, records..."}`}
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

          {/* Right: Action Buttons & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Emergency Button */}
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold transition border border-red-200 dark:border-red-800/50"
              title="Send Emergency Alert"
            >
              <ShieldAlert size={16} />
              <span className="hidden sm:inline">Emergency</span>
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
              title="View Profile & Settings"
            >
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                }
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

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </div>
  );
};

export default AppLayout;

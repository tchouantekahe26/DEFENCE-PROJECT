import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useLanguage } from "../../context/LanguageContext";
import { StatCard } from "../../components/common/StatCard";
import { getUserAvatar } from "../../utils/avatar";
import {
  Users,
  GraduationCap,
  Calendar,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Eye,
  EyeOff,
  TrendingUp,
  BarChart3,
  Activity,
  Sparkles,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { justifications, users } = useData();
  const { t, language } = useLanguage();

  // Privacy Mode (Hide Information)
  const [hideInfo, setHideInfo] = useState<boolean>(() => {
    return localStorage.getItem("unisphere_hide_info") === "true";
  });

  const toggleHideInfo = () => {
    const nextVal = !hideInfo;
    setHideInfo(nextVal);
    localStorage.setItem("unisphere_hide_info", String(nextVal));
  };

  const totalStudents = users.filter((u) => u.role === "student").length || 1248;
  const totalTeachers = users.filter((u) => u.role === "teacher").length || 86;
  const pendingJustifications = justifications.filter((j) => j.status === "PENDING");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================= GREETING HERO (PURPLE THEME) ================= */}
      <div className="bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-900/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/settings" title="Edit profile in Settings">
              <img
                src={getUserAvatar(user, "admin")}
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg shrink-0 hover:opacity-90 transition"
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-200">
                  {t("dashboard.admin_portal", "UNISPHERE Administration")}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-200 font-semibold">{language === "fr" ? "Système En Ligne" : "System Online"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {t("dashboard.welcome", "Welcome back")}, {hideInfo ? "••••••••••••" : (user?.name || "Dr. Admin Johnson")}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 mt-1">
                {language === "fr" ? "Bureau du Registre • Administrateur Général • ID: " : "Registry Office • Master Administrator • ID: "}
                <strong className="text-white">
                  {hideInfo ? "••••••" : (user?.identifier || "ADM001")}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* Privacy Mode Toggle */}
            <button
              type="button"
              onClick={toggleHideInfo}
              className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white text-xs font-bold transition border border-white/20 flex items-center gap-1.5 shadow-xs"
              title={hideInfo ? (language === "fr" ? "Afficher les informations" : "Display information") : (language === "fr" ? "Masquer les informations" : "Mask personal information")}
            >
              {hideInfo ? <Eye size={15} /> : <EyeOff size={15} />}
              <span>{hideInfo ? t("dashboard.show_info", "Show Info") : t("dashboard.hide_info", "Hide Info")}</span>
            </button>

            <Link
              to="/admin/users"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold transition border border-white/20 flex items-center gap-2"
            >
              <Users size={16} />
              <span>{t("dashboard.manage_users", "Manage Users")}</span>
            </Link>
            <Link
              to="/admin/timetable"
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <Calendar size={16} />
              <span>{t("nav.timetable_management", "Timetable")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 3 STAT CARDS (EMERGENCIES REMOVED) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title={t("dashboard.total_students", "Registered Students")}
          value={hideInfo ? "••••" : totalStudents}
          icon={GraduationCap}
          color="indigo"
          subtitle={language === "fr" ? "Tous les niveaux académiques" : "All academic levels"}
        />
        <StatCard
          title={t("dashboard.total_faculty", "Faculty Members")}
          value={hideInfo ? "•••" : totalTeachers}
          icon={Users}
          color="purple"
          subtitle={language === "fr" ? "Enseignants actifs" : "Active lecturers"}
        />
        <StatCard
          title={t("dashboard.pending_justifications", "Pending Absences")}
          value={pendingJustifications.length}
          icon={FileCheck}
          color="purple"
          subtitle={language === "fr" ? "En attente de vérification" : "Awaiting justification review"}
          badge={pendingJustifications.length > 0 ? (language === "fr" ? "Vérification requise" : "Review Required") : undefined}
        />
      </div>

      {/* ================= MAIN DASHBOARD SECTION ================= */}
      <div className="space-y-6">
        {/* Quick Administrative Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/users"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 shadow-md shadow-indigo-500/20 transition">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">User Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Create and manage students, teachers & institutional staff
            </p>
          </Link>

          <Link
            to="/admin/timetable"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] text-white flex items-center justify-center mb-3 group-hover:scale-110 shadow-md shadow-indigo-500/20 transition">
              <Calendar size={20} />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">Timetable Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure Level 1-3 classes, click-to-assign slots & saved archive
            </p>
          </Link>

          <Link
            to="/admin/absences"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 shadow-md shadow-purple-500/20 transition">
              <FileCheck size={20} />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Absence Oversight</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Review and audit student absence justifications across faculties
            </p>
          </Link>
        </div>

        {/* ================= INSTITUTIONAL PERFORMANCE ANALYTICS & VISUAL CHARTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Attendance Trend Chart (Area Graph) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Activity size={18} className="text-indigo-600" />
                  Campus Attendance Trend (This Week)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Aggregate student presence across all morning and afternoon sessions
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                Avg: 93.4%
              </span>
            </div>

            {/* SVG Interactive Area Chart */}
            <div className="h-52 w-full pt-4">
              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="adminAttendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="30" y1="20" x2="480" y2="20" stroke="#94a3b8" strokeOpacity="0.2" strokeDasharray="3 3" />
                <line x1="30" y1="60" x2="480" y2="60" stroke="#94a3b8" strokeOpacity="0.2" strokeDasharray="3 3" />
                <line x1="30" y1="100" x2="480" y2="100" stroke="#94a3b8" strokeOpacity="0.2" strokeDasharray="3 3" />
                <line x1="30" y1="140" x2="480" y2="140" stroke="#94a3b8" strokeOpacity="0.3" />

                {/* Y-axis labels */}
                <text x="5" y="24" className="text-[10px] fill-slate-400 font-mono">100%</text>
                <text x="12" y="64" className="text-[10px] fill-slate-400 font-mono">75%</text>
                <text x="12" y="104" className="text-[10px] fill-slate-400 font-mono">50%</text>

                {/* Area fill */}
                <polygon
                  points="50,28 130,40 210,22 290,52 370,30 450,46 450,140 50,140"
                  fill="url(#adminAttendanceGradient)"
                />

                {/* Line path */}
                <polyline
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="50,28 130,40 210,22 290,52 370,30 450,46"
                />

                {/* Data Points */}
                {[
                  { x: 50, y: 28, day: "Mon", val: "95%" },
                  { x: 130, y: 40, day: "Tue", val: "91%" },
                  { x: 210, y: 22, day: "Wed", val: "97%" },
                  { x: 290, y: 52, day: "Thu", val: "88%" },
                  { x: 370, y: 30, day: "Fri", val: "94%" },
                  { x: 450, y: 46, day: "Sat", val: "89%" },
                ].map((pt, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5.5"
                      className="fill-white stroke-indigo-600 stroke-[3] group-hover:scale-125 transition-transform"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-indigo-600 font-mono"
                    >
                      {pt.val}
                    </text>
                    <text
                      x={pt.x}
                      y="156"
                      textAnchor="middle"
                      className="text-[11px] font-semibold fill-slate-400"
                    >
                      {pt.day}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Grade Distribution Bell Curve */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-600" />
                  Examination Grade Distribution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Published academic results across all departments
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Total: 420 Marks</span>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { grade: "A (80 - 100%)", pct: 32, count: 134, color: "bg-emerald-500", text: "text-emerald-600" },
                { grade: "B (70 - 79%)", pct: 41, count: 172, color: "bg-indigo-600", text: "text-indigo-600" },
                { grade: "C (60 - 69%)", pct: 17, count: 71, color: "bg-sky-500", text: "text-sky-600" },
                { grade: "D (50 - 59%)", pct: 7, count: 29, color: "bg-amber-500", text: "text-amber-600" },
                { grade: "F (< 50%)", pct: 3, count: 14, color: "bg-rose-500", text: "text-rose-600" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.grade}</span>
                    <span className={`font-mono font-bold ${item.text}`}>
                      {item.count} students ({item.pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Absence Justifications Pending Review Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileCheck size={20} className="text-indigo-600" />
                Absence Justifications Pending Review
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Student requests submitted across all academic programs
              </p>
            </div>
            <Link
              to="/admin/absences"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 transition"
            >
              Open absence management
              <ArrowRight size={14} />
            </Link>
          </div>

          {pendingJustifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-xs text-slate-700 dark:text-slate-300">No Pending Absence Requests</p>
              <p className="text-[11px] mt-0.5">All student absence justifications have been processed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingJustifications.slice(0, 5).map((just) => (
                <div
                  key={just.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        just.studentAvatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={just.studentName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {just.studentName}{" "}
                        <span className="text-xs text-slate-400 font-normal">
                          ({just.studentMatric})
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {just.courseCode} on {just.absenceDate} • {just.reason}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/admin/absences"
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs transition shadow-sm shrink-0 ml-3"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

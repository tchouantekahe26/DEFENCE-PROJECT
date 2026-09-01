import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { StatCard } from "../../components/common/StatCard";
import {
  Users,
  GraduationCap,
  Megaphone,
  Award,
  Calendar,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileCheck,
  Building2,
  UserCheck,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { announcements, marks, emergencyReports, justifications, users } = useData();

  const totalStudents = users.filter((u) => u.role === "student").length || 1248;
  const totalTeachers = users.filter((u) => u.role === "teacher").length || 86;
  const pendingJustifications = justifications.filter((j) => j.status === "PENDING");
  const pendingResultsCount = marks.filter((m) => m.status === "submitted").length || 12;
  const activeEmergencies = emergencyReports.filter(
    (e) => e.status === "Reported" || e.status === "Dispatched"
  ).length;

  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================= GREETING HERO ================= */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-900/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/settings" title="Edit profile in Settings">
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                }
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg shrink-0 hover:opacity-90 transition"
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-200">
                  Administration Console
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-200 font-semibold">System Online</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome back, {user?.name || "Dr. Admin Johnson"}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 mt-1">
                Registry Office • Campus Master Administrator • ID:{" "}
                <strong className="text-white">{user?.identifier || "ADM001"}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              to="/admin/users"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold transition border border-white/20 flex items-center gap-2"
            >
              <Users size={16} />
              <span>Manage Users</span>
            </Link>
            <Link
              to="/admin/absences"
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-800 hover:bg-indigo-50 text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <FileCheck size={16} />
              <span>Absence Oversight</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 4 STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Registered Students"
          value={totalStudents}
          icon={GraduationCap}
          color="indigo"
          subtitle="All academic levels"
        />
        <StatCard
          title="Faculty Members"
          value={totalTeachers}
          icon={Users}
          color="sky"
          subtitle="Active lecturers"
        />
        <StatCard
          title="Pending Absences"
          value={pendingJustifications.length}
          icon={FileCheck}
          color="amber"
          subtitle="Awaiting justification review"
          badge={pendingJustifications.length > 0 ? "Review Required" : undefined}
        />
        <StatCard
          title="Active Emergencies"
          value={activeEmergencies}
          icon={ShieldAlert}
          color="rose"
          subtitle="Dispatched / in progress"
        />
      </div>

      {/* ================= MAIN DASHBOARD GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: ABSENCES & PENDING APPROVALS */}
        <div className="lg:col-span-2 space-y-6">
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
              <div className="p-6 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-xs text-slate-700 dark:text-slate-300">No Pending Absence Requests</p>
                <p className="text-[11px] mt-0.5">All student absence justifications have been processed.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingJustifications.slice(0, 4).map((just) => (
                  <div
                    key={just.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={just.studentAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                        alt={just.studentName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {just.studentName} <span className="text-xs text-slate-400 font-normal">({just.studentMatric})</span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {just.courseCode} on {just.absenceDate} • {just.reason}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/admin/absences"
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm shrink-0 ml-3"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Administrative Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">User Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create and manage student/staff roles</p>
            </Link>

            <Link
              to="/admin/timetable"
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Calendar size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Timetable Grid</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure program time slots & halls</p>
            </Link>

            <Link
              to="/admin/results"
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Award size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Results Verification</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review and approve grade releases</p>
            </Link>
          </div>
        </div>

        {/* RIGHT 1 COL: ANNOUNCEMENTS */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Megaphone size={18} className="text-indigo-600" />
                Announcements
              </h2>
              <Link
                to="/admin/announcements"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Create new
              </Link>
            </div>

            <div className="space-y-3">
              {recentAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                    {item.category} • {item.date}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

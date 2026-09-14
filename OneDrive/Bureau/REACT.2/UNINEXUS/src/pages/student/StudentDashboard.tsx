import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { StatCard } from "../../components/common/StatCard";
import { useTheme } from "../../context/ThemeContext";
import {
  GraduationCap,
  CalendarCheck,
  AlertTriangle,
  MessageSquare,
  Clock,
  MapPin,
  User,
  ArrowRight,
  FileCheck,
  Calendar,
  Award,
  Megaphone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Settings,
} from "lucide-react";

export const StudentDashboard: React.FC = () => {
  const { user, studentProfile } = useAuth();
  const { timetableSlots, announcements, attendanceRecords, justifications, courses, enrollments, assignments, submissions, marks } = useData();
  const { isDark } = useTheme();

  const studentId = user?.id || "usr-student-1";

  // Today's classes
  const todaySlots = timetableSlots
    .filter((slot) => slot.day === "Monday")
    .slice(0, 3);

  const recentAnnouncements = announcements.slice(0, 3);

  // Absence calculations
  const myAbsences = attendanceRecords.filter(
    (a) => a.studentId === studentId && a.status === "Absent"
  );
  const pendingJustifications = justifications.filter(
    (j) => j.studentId === studentId && j.status === "PENDING"
  );
  const excusedAbsences = justifications.filter(
    (j) => j.studentId === studentId && j.status === "APPROVED"
  );

  // Course performance calculations
  const enrolledCourses = enrollments.filter(
    (e) => e.studentId === studentId && e.status === "registered"
  );
  const courseCount = enrolledCourses.length;
  
  // Assignment tracking
  const courseAssignments = assignments.filter((a) =>
    enrolledCourses.some((e) => e.courseCode === a.courseCode)
  );
  const submittedAssignments = submissions.filter(
    (s) => s.studentId === studentId && s.status === "submitted"
  );
  const gradedAssignments = submissions.filter(
    (s) => s.studentId === studentId && s.status === "graded"
  );

  // Performance calculation
  const studentMarks = marks.filter((m) => m.studentId === studentId && m.status === "published");
  const avgGrade = studentMarks.length > 0
    ? (studentMarks.reduce((sum, m) => sum + m.totalMark, 0) / studentMarks.length).toFixed(1)
    : "85";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================= GREETING & PROFILE HERO ================= */}
      <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden transition ${
        isDark
          ? "bg-gradient-to-r from-emerald-700 to-teal-800"
          : "bg-gradient-to-r from-emerald-600 to-teal-700"
      }`}>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-900/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/student/settings" title="Edit profile in Settings">
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
                }
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg shrink-0 hover:opacity-90 transition"
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-200">
                  Student Portal
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                <span className="text-xs text-emerald-100 font-medium">
                  {studentProfile?.currentSemester || "Semester 1 (2024/2025)"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Welcome back, {user?.name?.split(" ")[0] || "Alex"}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                {user?.program || "B.Sc. Computer Science"} • {user?.level || "HND 2"} • ID:{" "}
                <strong className="text-white">{user?.identifier || "CS2025001"}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              to="/student/absences"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold transition border border-white/20 flex items-center gap-2"
            >
              <FileCheck size={16} />
              <span>Justify Absence</span>
            </Link>
            <Link
              to="/student/settings"
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <Settings size={16} />
              <span>Profile & Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 4 STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Current GPA"
          value={avgGrade}
          icon={GraduationCap}
          color="emerald"
          badge="Good Standing"
          trend={{ value: "0.15", isPositive: true }}
        />
        <StatCard
          title="Attendance Rate"
          value={`${studentProfile?.attendanceRate || 89}%`}
          icon={CalendarCheck}
          color="sky"
          subtitle="Target: ≥75% min required"
        />
        <StatCard
          title="Enrolled Courses"
          value={courseCount}
          icon={Award}
          color="purple"
          subtitle={`${submittedAssignments.length} assignments submitted`}
        />
        <StatCard
          title="Grades Published"
          value={studentMarks.length}
          icon={FileCheck}
          color="indigo"
          subtitle={`${gradedAssignments.length} assignments graded`}
        />
      </div>

      {/* ================= MAIN DASHBOARD GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: TIMETABLE & ABSENCE SUMMARY (2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Absence & Justification Quick Status Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileCheck className="text-emerald-600" size={20} />
                  Absence & Justification Status
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track your absences and submit official justifications
                </p>
              </div>
              <Link
                to="/student/absences"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 transition"
              >
                View all absences
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Unjustified</span>
                  <AlertCircle size={16} className="text-amber-600" />
                </div>
                <p className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-2">
                  {myAbsences.filter((a) => !justifications.some((j) => (j.absenceId === a.id || j.id === a.justificationId) && j.status !== "NOT_JUSTIFIED")).length}
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">Awaiting your justification</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Pending Review</span>
                  <Clock size={16} className="text-blue-600" />
                </div>
                <p className="text-2xl font-black text-blue-900 dark:text-blue-200 mt-2">
                  {pendingJustifications.length}
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1">Under teacher/admin review</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Excused</span>
                  <CheckCircle2 size={16} className="text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-2">
                  {excusedAbsences.length}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Officially approved</p>
              </div>
            </div>
          </div>

          {/* Today's Timetable Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  My Timetable (Today)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Scheduled lectures and laboratory sessions for Monday
                </p>
              </div>
              <Link
                to="/student/timetable"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 transition"
              >
                View full timetable
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {todaySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/40 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700 transition group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-xs shrink-0">
                      {slot.courseCode}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 transition">
                        {slot.courseTitle}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <User size={13} className="text-slate-400" />
                          {slot.lecturerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          {slot.classroom}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
                      <Clock size={13} className="text-emerald-600" />
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ANNOUNCEMENTS */}
        <div className="space-y-6">
          {/* Announcements Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Megaphone size={18} className="text-emerald-600" />
                Recent Announcements
              </h2>
              <Link
                to="/student/announcements"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:bg-slate-100/80 transition"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                    {item.category} • {item.date}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
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

export default StudentDashboard;

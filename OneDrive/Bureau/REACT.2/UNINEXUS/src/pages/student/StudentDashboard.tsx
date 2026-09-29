import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useLanguage } from "../../context/LanguageContext";
import { StatCard } from "../../components/common/StatCard";
import { getUserAvatar } from "../../utils/avatar";
import {
  GraduationCap,
  CalendarCheck,
  Clock,
  MapPin,
  User as UserIcon,
  ArrowRight,
  FileCheck,
  Calendar,
  Award,
  CheckCircle2,
  AlertCircle,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";

export const StudentDashboard: React.FC = () => {
  const { user, studentProfile, updateProfile } = useAuth();
  const { t, language } = useLanguage();
  const {
    timetableSlots,
    attendanceRecords,
    justifications,
    enrollments,
    submissions,
    marks,
  } = useData();

  // Privacy Mode (Hide Information)
  const [hideInfo, setHideInfo] = useState<boolean>(() => {
    return user?.hideInfo ?? (localStorage.getItem("unisphere_hide_info") === "true");
  });

  const toggleHideInfo = () => {
    const nextVal = !hideInfo;
    setHideInfo(nextVal);
    localStorage.setItem("unisphere_hide_info", String(nextVal));
    updateProfile({ hideInfo: nextVal });
  };

  const studentId = user?.id || "";

  // Course performance calculations
  const enrolledCourses = enrollments.filter(
    (e) => e.studentId === studentId && e.status === "registered"
  );
  const courseCount = enrolledCourses.length;
  const enrolledCourseCodes = enrolledCourses
    .map((e) => e.courseCode)
    .filter((c): c is string => typeof c === "string");

  // Today's classes - match against actual enrolled courses
  const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  const activeDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(todayName)
    ? todayName
    : "Monday";
  const todaySlots = timetableSlots
    .filter((slot) => slot.day === activeDay && slot.courseCode && enrolledCourseCodes.includes(slot.courseCode))
    .slice(0, 4);

  const isMe = (item: { studentId?: string; matricNumber?: string; studentName?: string }) => {
    if (!item) return false;
    if (studentId && (item.studentId === studentId || String(item.studentId) === String(studentId))) return true;
    if (user?.identifier && item.matricNumber && item.matricNumber.trim().toUpperCase() === user.identifier.trim().toUpperCase()) return true;
    if (user?.name && item.studentName && item.studentName.trim().toUpperCase() === user.name.trim().toUpperCase()) return true;
    return false;
  };

  // Absence calculations
  const myAttendance = attendanceRecords.filter((a) => isMe(a));
  const myAbsences = myAttendance.filter((a) => a.status.toLowerCase() === "absent");
  const pendingJustifications = justifications.filter(
    (j) => isMe(j) && j.status === "PENDING"
  );
  const excusedAbsences = justifications.filter(
    (j) => isMe(j) && j.status === "APPROVED"
  );

  const totalAttended = myAttendance.filter((a) =>
    ["present", "late", "excused"].includes(a.status.toLowerCase())
  ).length;
  const realAttendancePercentage =
    myAttendance.length > 0 ? Math.round((totalAttended / myAttendance.length) * 100) : null;

  // Assignment tracking
  const submittedAssignments = submissions.filter(
    (s) => (s.studentId === studentId || String(s.studentId) === String(studentId)) && s.status === "submitted"
  );
  const gradedAssignments = submissions.filter(
    (s) => (s.studentId === studentId || String(s.studentId) === String(studentId)) && s.status === "graded"
  );

  // Performance calculation - marks directly appear without waiting for admin validation
  const studentMarks = marks.filter((m) => isMe(m));
  const avgGrade =
    studentMarks.length > 0
      ? (studentMarks.reduce((sum, m) => sum + m.totalMark, 0) / studentMarks.length).toFixed(1)
      : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================= GREETING & PROFILE HERO (UNIFIED PURPLE THEME) ================= */}
      <div className="rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3]">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-900/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/student/settings" title="Edit profile in Settings">
              <img
                src={getUserAvatar(user, "student")}
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg shrink-0 hover:opacity-90 transition"
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-200">
                  {t("dashboard.student_portal", "UNISPHERE Student Portal")}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-indigo-100 font-medium">
                  {studentProfile?.currentSemester || (language === "fr" ? "Semestre 1 (2024/2025)" : "Semester 1 (2024/2025)")}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {t("dashboard.welcome", "Welcome back")}, {hideInfo ? "••••••••" : (user?.name?.split(" ")[0] || "Student")}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 mt-1">
                {hideInfo ? "••••••••••••••••••••" : (user?.department || "Computer Science")} • {language === "fr" ? "Classe: " : "Class: "}<span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">{hideInfo ? "••••" : (user?.className || "BA1A")}</span> • {hideInfo ? "••••••" : (user?.level || "Level 2")} • ID:{" "}
                <strong className="text-white">
                  {hideInfo ? "••••••" : (user?.identifier || "STU-PENDING")}
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
              to="/student/attendance?tab=justifications"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold transition border border-white/20 flex items-center gap-2"
            >
              <FileCheck size={16} />
              <span>{language === "fr" ? "Justifier une absence" : "Justify Absence"}</span>
            </Link>
            <Link
              to="/student/settings"
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <Settings size={16} />
              <span>{language === "fr" ? "Profil & Paramètres" : "Profile & Settings"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 4 STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={t("dashboard.average_gpa", "Current GPA")}
          value={hideInfo ? "•••" : (avgGrade !== null ? avgGrade : "N/A")}
          icon={GraduationCap}
          color="indigo"
          badge={avgGrade !== null ? (language === "fr" ? "Bonne situation" : "Good Standing") : (language === "fr" ? "Aucune note" : "No Grades Yet")}
          trend={avgGrade !== null ? { value: "0.15", isPositive: true } : undefined}
        />
        <StatCard
          title={t("dashboard.attendance_rate", "Attendance Rate")}
          value={
            hideInfo
              ? "••%"
              : realAttendancePercentage !== null
              ? `${realAttendancePercentage}%`
              : "N/A"
          }
          icon={CalendarCheck}
          color="purple"
          subtitle={
            realAttendancePercentage !== null
              ? (language === "fr" ? "Objectif: ≥75% min requis" : "Target: ≥75% min required")
              : (language === "fr" ? "Aucune présence enregistrée" : "No attendance recorded yet")
          }
        />
        <StatCard
          title={t("dashboard.registered_courses", "Enrolled Courses")}
          value={courseCount}
          icon={Award}
          color="indigo"
          subtitle={language === "fr" ? `${submittedAssignments.length} devoirs soumis` : `${submittedAssignments.length} assignments submitted`}
        />
        <StatCard
          title={language === "fr" ? "Notes Publiées" : "Grades Published"}
          value={studentMarks.length}
          icon={FileCheck}
          color="purple"
          subtitle={language === "fr" ? `${gradedAssignments.length} devoirs notés` : `${gradedAssignments.length} assignments graded`}
        />
      </div>

      {/* ================= MAIN DASHBOARD GRID (CLEAN DUAL COLUMN) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Absence & Justification Quick Status Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
                Absence & Justification Status
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your absences and submit official justifications
              </p>
            </div>
            <Link
              to="/student/attendance?tab=justifications"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 transition"
            >
              View all
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
                {hideInfo
                  ? "•"
                  : myAbsences.filter(
                      (a) =>
                        !justifications.some(
                          (j) => (j.absenceId === a.id || j.id === a.justificationId) && j.status !== "NOT_JUSTIFIED"
                        )
                    ).length}
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">Awaiting justification</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">Pending</span>
                <Clock size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="text-2xl font-black text-indigo-900 dark:text-indigo-200 mt-2">
                {hideInfo ? "•" : pendingJustifications.length}
              </p>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-1">Under teacher review</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Excused</span>
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-2">
                {hideInfo ? "•" : excusedAbsences.length}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Officially approved</p>
            </div>
          </div>
        </div>

        {/* Today's Timetable Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="text-purple-600 dark:text-purple-400" size={20} />
                My Timetable (Today)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scheduled lectures and laboratory sessions for Monday
              </p>
            </div>
            <Link
              to="/student/timetable"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1 transition"
            >
              Full schedule
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {todaySlots.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 text-slate-500 dark:text-slate-400 text-sm">
                <Calendar className="mx-auto mb-2 text-indigo-500 opacity-70" size={24} />
                No lectures scheduled for today. Check your full timetable for upcoming classes.
              </div>
            ) : (
              todaySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 border border-slate-200/70 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700/70 transition group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md shadow-indigo-500/25">
                      {slot.courseCode}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {slot.courseTitle}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <UserIcon size={13} className="text-slate-400" />
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
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-800 dark:text-indigo-200 shadow-2xs">
                      <Clock size={13} className="text-indigo-600 dark:text-indigo-400" />
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

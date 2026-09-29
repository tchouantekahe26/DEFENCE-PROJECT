import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useLanguage } from "../../context/LanguageContext";
import { StatCard } from "../../components/common/StatCard";
import { getUserAvatar } from "../../utils/avatar";
import {
  Users,
  CalendarCheck,
  CalendarClock,
  ArrowRight,
  FileCheck,
  CheckCircle2,
  FileEdit,
  Eye,
  EyeOff,
  BookOpen,
  Activity,
  TrendingUp,
  BarChart3,
  QrCode,
} from "lucide-react";

export const TeacherDashboard: React.FC = () => {
  const { user, teacherProfile, updateProfile } = useAuth();
  const { courses, justifications, users } = useData();
  const { t, language } = useLanguage();

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

  const teacherId = user?.id || "usr-teacher-1";

  // Filter courses taught by this lecturer
  const myClasses = courses.filter(
    (c) => c.lecturerId === teacherId || c.lecturerName.includes(user?.name?.split(" ")[1] || "Smith")
  );

  const myJustifications = justifications.filter(
    (j) => j.lecturerId === teacherId || j.lecturerName.includes(user?.name?.split(" ")[1] || "Smith")
  );
  const pendingJustifications = myJustifications.filter((j) => j.status === "PENDING");
  const totalStudentsCount = users.filter((u) => u.role === "student").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================= GREETING HERO (UNIFIED PURPLE THEME) ================= */}
      <div className="bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-900/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/teacher/settings" title="Edit profile in Settings">
              <img
                src={getUserAvatar(user, "teacher")}
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg shrink-0 hover:opacity-90 transition"
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-200">
                  {t("dashboard.faculty_portal", "UNISPHERE Faculty Portal")}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                <span className="text-xs text-indigo-100 font-medium">
                  {hideInfo ? "••••••••••••••••••••" : (user?.department || "Department of Computer Science")}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {t("dashboard.hello", "Hello")}, {hideInfo ? "••••••••" : `${teacherProfile?.title || "Dr."} ${user?.name?.split(" ")[1] || "Smith"}`}! 🎓
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 mt-1">
                Staff ID: <strong className="text-white">{hideInfo ? "••••••" : (user?.identifier || "TCH102")}</strong> • Office: {hideInfo ? "••••••••" : (teacherProfile?.officeLocation || "Block B, Room 304")}
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
              to="/teacher/availability"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold transition border border-white/20 flex items-center gap-2"
            >
              <CalendarClock size={16} />
              <span>{t("dashboard.submit_availability", "Timetable Availability")}</span>
            </Link>
            <Link
              to="/teacher/attendance"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold transition border border-white/20 flex items-center gap-2"
            >
              <CalendarCheck size={16} />
              <span>{t("dashboard.mark_attendance", "Mark Attendance")}</span>
            </Link>
            <Link
              to="/teacher/absences"
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <FileCheck size={16} />
              <span>{language === "fr" ? "Examiner les justificatifs" : "Review Justifications"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 4 STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={t("dashboard.active_courses", "Assigned Courses")}
          value={myClasses.length}
          icon={CalendarCheck}
          color="indigo"
          subtitle={language === "fr" ? "Classes actives du semestre" : "Active semester classes"}
        />
        <StatCard
          title={t("dashboard.total_students", "Enrolled Students")}
          value={hideInfo ? "•••" : totalStudentsCount}
          icon={Users}
          color="purple"
          subtitle={language === "fr" ? "Toutes sections confondues" : "Across all lecture sections"}
        />
        <StatCard
          title={t("dashboard.pending_justifications", "Pending Justifications")}
          value={pendingJustifications.length}
          icon={FileCheck}
          color="purple"
          subtitle={language === "fr" ? "En attente de vérification" : "Awaiting teacher review"}
          badge={pendingJustifications.length > 0 ? (language === "fr" ? "Action requise" : "Action Required") : (language === "fr" ? "À jour" : "All Clear")}
        />
        <StatCard
          title={language === "fr" ? "Devoirs soumis" : "Coursework Submitted"}
          value="18"
          icon={FileEdit}
          color="indigo"
          subtitle={language === "fr" ? "En attente de notation finale" : "Awaiting final grading"}
        />
      </div>

      {/* ================= COURSE ENGAGEMENT & ATTENDANCE ANALYTICS ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity size={20} className="text-indigo-600 dark:text-indigo-400" />
              Assigned Courses Attendance & Engagement Health
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live semester attendance tracking across your assigned lectures
            </p>
          </div>
          <Link
            to="/teacher/attendance"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition border border-indigo-200 dark:border-indigo-800"
          >
            <QrCode size={15} />
            <span>Launch Attendance QR</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(myClasses.length > 0 ? myClasses.slice(0, 3) : courses.slice(0, 3)).map((course, i) => {
            const rates = [94, 88, 92];
            const rate = rates[i % rates.length];
            return (
              <div
                key={course.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {course.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {rate}% Attendance
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {course.title}
                </h4>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${rate}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Class: {course.level || "Level 2"}</span>
                  <span>{course.scheduleDays || "Mon, Wed"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN DASHBOARD GRID (CLEAN DUAL COLUMN) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Absence Justifications Pending Review Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileCheck size={20} className="text-indigo-600 dark:text-indigo-400" />
                Absence Justification Requests
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Student submissions for missed lecture sessions requiring verification
              </p>
            </div>
            <Link
              to="/teacher/absences"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 transition"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          {pendingJustifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-xs text-slate-700 dark:text-slate-300">All Justifications Reviewed!</p>
              <p className="text-[11px] mt-0.5">No pending absence requests from your students at this time.</p>
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
                      src={
                        just.studentAvatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={just.studentName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {just.studentName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {just.courseCode} on {just.absenceDate} • {just.reason}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/teacher/absences"
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs transition shadow-sm shrink-0 ml-3"
                  >
                    {t("dashboard.review", "Review")}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Classes & Quick Attendance */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen size={20} className="text-purple-600 dark:text-purple-400" />
                {t("dashboard.course_sessions", "Course Sessions & Attendance")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("dashboard.course_sessions_desc", "Quick access to attendance marking for your assigned classes")}
              </p>
            </div>
            <Link
              to="/teacher/attendance"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1 transition"
            >
              {t("dashboard.open_marker", "Open marker")}
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {myClasses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:bg-indigo-50/20 transition group"
              >
                <div>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block">
                    {course.code}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {course.classroom} • {course.scheduleDays} ({course.scheduleTime})
                  </p>
                </div>

                <Link
                  to="/teacher/attendance"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs transition shadow-sm shadow-indigo-500/20"
                >
                  Take Attendance
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

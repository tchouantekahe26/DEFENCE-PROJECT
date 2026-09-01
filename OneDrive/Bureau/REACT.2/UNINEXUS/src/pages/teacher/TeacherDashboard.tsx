import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { StatCard } from "../../components/common/StatCard";
import {
  Users,
  CalendarCheck,
  ArrowRight,
  FileCheck,
  Clock,
  Award,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Settings,
} from "lucide-react";

export const TeacherDashboard: React.FC = () => {
  const { user, teacherProfile } = useAuth();
  const { courses, announcements, justifications } = useData();

  const teacherId = user?.id || "usr-teacher-1";

  // Filter courses taught by this lecturer
  const myClasses = courses.filter(
    (c) => c.lecturerId === teacherId || c.lecturerName.includes(user?.name?.split(" ")[1] || "Smith")
  );

  const myJustifications = justifications.filter(
    (j) => j.lecturerId === teacherId || j.lecturerName.includes(user?.name?.split(" ")[1] || "Smith")
  );
  const pendingJustifications = myJustifications.filter((j) => j.status === "PENDING");

  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================= GREETING HERO ================= */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-sky-900/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/teacher/settings" title="Edit profile in Settings">
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                }
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg shrink-0 hover:opacity-90 transition"
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-sky-200">
                  Faculty Portal
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-300" />
                <span className="text-xs text-sky-100 font-medium">
                  {user?.department || "Department of Computer Science"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Hello, {teacherProfile?.title || "Dr."} {user?.name?.split(" ")[1] || "Smith"}! 🎓
              </h1>
              <p className="text-xs sm:text-sm text-sky-100 mt-1">
                Staff ID: <strong className="text-white">{user?.identifier || "TCH102"}</strong> • Office: {teacherProfile?.officeLocation || "Block B, Room 304"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              to="/teacher/attendance"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold transition border border-white/20 flex items-center gap-2"
            >
              <CalendarCheck size={16} />
              <span>Mark Attendance</span>
            </Link>
            <Link
              to="/teacher/absences"
              className="px-4 py-2.5 rounded-xl bg-white text-sky-800 hover:bg-sky-50 text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <FileCheck size={16} />
              <span>Review Justifications</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 4 STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Assigned Courses"
          value={myClasses.length || 3}
          icon={CalendarCheck}
          color="sky"
          subtitle="Active semester classes"
        />
        <StatCard
          title="Enrolled Students"
          value={teacherProfile?.totalStudents || 126}
          icon={Users}
          color="indigo"
          subtitle="Across all lecture sections"
        />
        <StatCard
          title="Pending Justifications"
          value={pendingJustifications.length}
          icon={FileCheck}
          color="amber"
          subtitle="Awaiting teacher review"
          badge={pendingJustifications.length > 0 ? "Action Required" : "All Clear"}
        />
        <StatCard
          title="Coursework Submitted"
          value="18"
          icon={FileEdit}
          color="emerald"
          subtitle="Awaiting final grading"
        />
      </div>

      {/* ================= MAIN DASHBOARD GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: PENDING JUSTIFICATIONS & ATTENDANCE ACTIONS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Absence Justifications Pending Review Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileCheck size={20} className="text-sky-600" />
                  Absence Justification Requests
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Student submissions for missed lecture sessions requiring verification
                </p>
              </div>
              <Link
                to="/teacher/absences"
                className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-1 transition"
              >
                View all requests
                <ArrowRight size={14} />
              </Link>
            </div>

            {pendingJustifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-xs text-slate-700 dark:text-slate-300">All Justifications Reviewed!</p>
                <p className="text-[11px] mt-0.5">No pending absence requests from your students at this time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingJustifications.slice(0, 3).map((just) => (
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
                          {just.studentName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {just.courseCode} on {just.absenceDate} • {just.reason}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/teacher/absences"
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition shadow-sm shrink-0 ml-3"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Classes & Quick Attendance */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Course Sessions & Attendance
              </h2>
              <Link
                to="/teacher/attendance"
                className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-1 transition"
              >
                Open attendance marker
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {myClasses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700"
                >
                  <div>
                    <span className="text-xs font-black text-sky-600 dark:text-sky-400 block">
                      {course.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {course.classroom} • {course.scheduleDays} ({course.scheduleTime})
                    </p>
                  </div>

                  <Link
                    to="/teacher/attendance"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
                  >
                    Take Attendance
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 1 COL: ANNOUNCEMENTS */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Megaphone size={18} className="text-sky-600" />
                Faculty Announcements
              </h2>
              <Link
                to="/teacher/announcements"
                className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
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

export default TeacherDashboard;

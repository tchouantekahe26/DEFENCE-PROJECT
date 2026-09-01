import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { StatCard } from "../../components/common/StatCard";
import { Badge } from "../../components/common/Badge";
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
} from "lucide-react";

export const StudentAttendance: React.FC = () => {
  const { user } = useAuth();
  const { attendanceRecords, courses, enrollments } = useData();

  const studentId = user?.id || "usr-student-1";

  // Course-by-course attendance summary
  const studentEnrollments = enrollments.filter(
    (e) => e.studentId === studentId && e.status === "registered"
  );

  const courseStats = studentEnrollments.map((enr) => {
    const course = courses.find((c) => c.id === enr.courseId);
    const courseRecords = attendanceRecords.filter(
      (r) => r.courseCode === enr.courseCode && r.studentId === studentId
    );

    const totalClasses = 14; // semester class count
    const attendedClasses =
      courseRecords.length > 0
        ? courseRecords.filter((r) => r.status === "Present" || r.status === "Late").length
        : enr.courseCode === "CS 205"
        ? 9 // 64% warning demo
        : 13; // default healthy attendance

    const percentage = Math.round((attendedClasses / totalClasses) * 100);
    const isWarning = percentage < 75;

    return {
      courseCode: enr.courseCode,
      courseTitle: enr.courseTitle,
      lecturer: course?.lecturerName || "Faculty Instructor",
      totalClasses,
      attendedClasses,
      absentCount: totalClasses - attendedClasses,
      percentage,
      isWarning,
    };
  });

  const overallPercentage =
    courseStats.length > 0
      ? Math.round(
          courseStats.reduce((sum, c) => sum + c.percentage, 0) /
            courseStats.length
        )
      : 89;

  const lowAttendanceCount = courseStats.filter((c) => c.isWarning).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Attendance Record & Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track course attendance percentages, presence history and eligibility requirements
        </p>
      </div>

      {/* Warning Notice if any course < 75% */}
      {lowAttendanceCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Attendance Warning Alert
            </h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              You have <strong>{lowAttendanceCount} course(s)</strong> below the
              institutional 75% minimum attendance threshold. Students below 75%
              attendance may be disqualified from sitting for the semester final exams.
            </p>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Overall Attendance"
          value={`${overallPercentage}%`}
          icon={CalendarCheck}
          color="emerald"
          badge={overallPercentage >= 75 ? "Eligible for Exams" : "At Risk"}
        />
        <StatCard
          title="Courses in Good Standing"
          value={courseStats.filter((c) => !c.isWarning).length}
          icon={CheckCircle2}
          color="sky"
          subtitle="≥75% attendance rate"
        />
        <StatCard
          title="Attendance Warnings"
          value={lowAttendanceCount}
          icon={AlertTriangle}
          color="amber"
          subtitle="Requires attention"
        />
      </div>

      {/* Course-by-Course Attendance Progress */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Course Attendance Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Current attendance rates for all registered semester courses
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {courseStats.map((item) => (
            <div
              key={item.courseCode}
              className={`p-5 rounded-2xl border transition ${
                item.isWarning
                  ? "bg-amber-50/40 border-amber-200"
                  : "bg-slate-50 border-slate-200/80"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                      {item.courseCode}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {item.courseTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Lecturer: {item.lecturer} • Attended: {item.attendedClasses} of{" "}
                    {item.totalClasses} classes
                  </p>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-auto">
                  <div className="text-right">
                    <span
                      className={`text-xl font-extrabold ${
                        item.isWarning ? "text-amber-700" : "text-emerald-700"
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                  <Badge variant={item.isWarning ? "warning" : "success"}>
                    {item.isWarning ? "Warning (<75%)" : "Good Standing"}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      item.isWarning ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Policy Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 flex items-start gap-4 text-xs text-slate-600">
        <Info size={20} className="text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-sm">
            University Attendance Regulations
          </h4>
          <p className="leading-relaxed">
            1. Students must attend a minimum of 75% of all scheduled lectures, tutorials, and laboratories.
          </p>
          <p className="leading-relaxed">
            2. Medical certificates for absences must be submitted to the Department Registry within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

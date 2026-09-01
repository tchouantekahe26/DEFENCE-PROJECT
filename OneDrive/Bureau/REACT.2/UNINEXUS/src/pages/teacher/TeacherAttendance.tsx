import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Users,
  Search,
  Check,
} from "lucide-react";
import type { AttendanceStatus } from "../../types";

export const TeacherAttendance: React.FC = () => {
  const { user } = useAuth();
  const { courses, users, saveAttendance } = useData();

  const teacherId = user?.id || "usr-teacher-1";
  const myClasses = courses.filter(
    (c) => c.lecturerId === teacherId || c.lecturerName.includes("Smith")
  );

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    myClasses[0]?.id || "crs-3"
  );
  const [sessionDate, setSessionDate] = useState("2025-05-20");
  const [sessionTime, setSessionTime] = useState<"Morning" | "Afternoon" | "Evening">(
    "Morning"
  );
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || myClasses[0];

  const studentUsers = users.filter((u) => u.role === "student");

  // Local attendance state per student: studentId -> AttendanceStatus
  const [attendanceState, setAttendanceState] = useState<
    Record<string, AttendanceStatus>
  >({
    "usr-student-1": "Present",
    "usr-student-2": "Present",
    "usr-student-3": "Absent",
    "usr-student-4": "Present",
    "usr-student-5": "Late",
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const next: Record<string, AttendanceStatus> = {};
    studentUsers.forEach((s) => {
      next[s.id] = status;
    });
    setAttendanceState(next);
  };

  // Compute live counters
  const presentCount = Object.values(attendanceState).filter(
    (s) => s === "Present"
  ).length;
  const absentCount = Object.values(attendanceState).filter(
    (s) => s === "Absent"
  ).length;
  const lateCount = Object.values(attendanceState).filter(
    (s) => s === "Late"
  ).length;

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const recordsToSave = studentUsers.map((s) => ({
        courseId: currentCourse.id,
        courseCode: currentCourse.code,
        studentId: s.id,
        studentName: s.name,
        matricNumber: s.identifier,
        date: sessionDate,
        session: sessionTime,
        status: attendanceState[s.id] || "Present",
      }));

      await saveAttendance(recordsToSave);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = studentUsers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.identifier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Take Attendance — {currentCourse?.title} ({currentCourse?.code})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Log lecture presence, tardiness and absences for officially enrolled students
          </p>
        </div>

        {/* Course Select Dropdown */}
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-sky-500 shadow-2xs"
        >
          {myClasses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Main Attendance Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {/* Controls and Stats Row matching mockup */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Session Date
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Select Session
              </label>
              <select
                value={sessionTime}
                onChange={(e) =>
                  setSessionTime(
                    e.target.value as "Morning" | "Afternoon" | "Evening"
                  )
                }
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-sky-500"
              >
                <option value="Morning">Morning (08:00 - 12:00)</option>
                <option value="Afternoon">Afternoon (13:00 - 16:00)</option>
                <option value="Evening">Evening (16:00 - 19:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Quick Mark All
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMarkAll("Present")}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition border border-emerald-200"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll("Absent")}
                  className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 transition border border-red-200"
                >
                  All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Live Counters matching mockup */}
          <div className="flex items-center gap-6 bg-slate-50 p-3.5 px-6 rounded-2xl border border-slate-200/60 self-start lg:self-auto">
            <div className="text-center">
              <span className="text-[11px] text-emerald-700 font-bold block">
                Present
              </span>
              <span className="text-2xl font-black text-emerald-600">
                {presentCount}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[11px] text-red-700 font-bold block">
                Absent
              </span>
              <span className="text-2xl font-black text-red-600">
                {absentCount}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[11px] text-amber-700 font-bold block">
                Late
              </span>
              <span className="text-2xl font-black text-amber-600">
                {lateCount}
              </span>
            </div>
          </div>
        </div>

        {/* Student Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 w-12">#</th>
                <th className="pb-3">Student ID</th>
                <th className="pb-3">Student Name</th>
                <th className="pb-3 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student, idx) => {
                const currentStatus =
                  attendanceState[student.id] || "Present";

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 font-bold text-slate-400 text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-sky-700 text-xs">
                      {student.identifier}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={
                          student.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        }
                        alt={student.name}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      {student.name}
                    </td>
                    <td className="py-3.5 text-right">
                      {/* 3 Status Toggle Buttons */}
                      <div className="inline-flex rounded-xl p-1 bg-slate-100 gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "Present")}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                            currentStatus === "Present"
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-emerald-700"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "Absent")}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                            currentStatus === "Absent"
                              ? "bg-red-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-red-700"
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, "Late")}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                            currentStatus === "Late"
                              ? "bg-amber-500 text-white shadow-xs"
                              : "text-slate-600 hover:text-amber-700"
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Save Bar */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {saveSuccess ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 size={16} />
              Attendance Saved & Recorded!
            </div>
          ) : (
            <span className="text-xs text-slate-400">
              Changes will be recorded in official university attendance logs.
            </span>
          )}

          <button
            onClick={handleSaveAttendance}
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-200 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import {
  CalendarCheck,
  CheckCircle2,
  Save,
  Search,
  History,
  Edit3,
  QrCode,
  Copy,
  Check,
  Sparkles,
  Clock,
  Smartphone,
} from "lucide-react";
import type { AttendanceStatus, AttendanceRecord } from "../../types";
import { DEFAULT_AVATARS } from "../../utils/avatar";

export const TeacherAttendance: React.FC = () => {
  const { user } = useAuth();
  const { courses, users, attendanceRecords, timetableSlots, saveAttendance } = useData();

  // Official timetable periods matching institutional schedule
  const TIMETABLE_PERIODS = [
    { value: "07:30 - 09:30", label: "07:30 - 09:30", period: "Period 1" },
    { value: "09:30 - 11:30", label: "09:30 - 11:30", period: "Period 2" },
    { value: "12:45 - 14:45", label: "12:45 - 14:45", period: "Period 3" },
    { value: "14:45 - 16:45", label: "14:45 - 16:45", period: "Period 4" },
  ];

  const normalizeSession = (s?: string) => {
    if (!s) return "07:30 - 09:30";
    if (s === "Morning") return "07:30 - 09:30";
    if (s === "Afternoon") return "12:45 - 14:45";
    if (s === "Evening") return "14:45 - 16:45";
    return s;
  };

  const teacherId = user?.id || "usr-teacher-1";

  // Filter courses taught by this teacher, fallback to all courses if none match
  const myClasses = useMemo(() => {
    const lastName = user?.name ? user.name.split(" ").slice(-1)[0] : "Williams";
    const matched = courses.filter(
      (c) =>
        c.lecturerId === teacherId ||
        (user?.name && c.lecturerName.toLowerCase().includes(user.name.toLowerCase())) ||
        c.lecturerName.toLowerCase().includes(lastName.toLowerCase())
    );
    return matched.length > 0 ? matched : courses;
  }, [courses, teacherId, user]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => myClasses[0]?.id || "crs-1");
  const [sessionDate, setSessionDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [sessionTime, setSessionTime] = useState<string>("07:30 - 09:30");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Late option is ONLY available for period 07:30 - 09:30.
  // For any period above 07:30 - 09:30, the option to mark late disappears.
  const isLateAllowed = sessionTime.trim().startsWith("07:30") || normalizeSession(sessionTime) === "07:30 - 09:30";

  // Dynamic QR Code Attendance Session State
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [sessionPin, setSessionPin] = useState("849201");
  const [copiedPin, setCopiedPin] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300);

  // Local overrides for the current editing session (key: studentId, value: status)
  const [attendanceOverrides, setAttendanceOverrides] = useState<Record<string, AttendanceStatus>>({});

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || myClasses[0];

  const studentUsers = useMemo(() => {
    return users.filter((u) => u.role === "student");
  }, [users]);

  // Merge database records with user overrides cleanly without calling setState in an effect
  const attendanceState = useMemo(() => {
    if (!currentCourse) return {};

    const existingForSession = attendanceRecords.filter(
      (r) =>
        (r.courseId === currentCourse.id || r.courseCode === currentCourse.code) &&
        r.date === sessionDate &&
        (!r.session || r.session === sessionTime || normalizeSession(r.session) === normalizeSession(sessionTime))
    );

    const merged: Record<string, AttendanceStatus> = {};
    studentUsers.forEach((s) => {
      let st: AttendanceStatus = "Present";
      if (attendanceOverrides[s.id]) {
        st = attendanceOverrides[s.id];
      } else {
        const existing = existingForSession.find((r) => r.studentId === s.id);
        if (existing) {
          const norm = existing.status.toLowerCase();
          st = norm === "absent" ? "Absent" : norm === "late" ? (isLateAllowed ? "Late" : "Absent") : "Present";
        } else {
          st = "Present";
        }
      }
      if (!isLateAllowed && st === "Late") {
        st = "Absent";
      }
      merged[s.id] = st;
    });

    return merged;
  }, [attendanceRecords, currentCourse, sessionDate, sessionTime, studentUsers, attendanceOverrides, isLateAllowed]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    if (status === "Late" && !isLateAllowed) return;
    setAttendanceOverrides((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    if (status === "Late" && !isLateAllowed) return;
    const next: Record<string, AttendanceStatus> = {};
    studentUsers.forEach((s) => {
      next[s.id] = status;
    });
    setAttendanceOverrides(next);
  };

  const handleCourseSelect = (id: string) => {
    setSelectedCourseId(id);
    setAttendanceOverrides({});
  };

  const handleDateSelect = (date: string) => {
    setSessionDate(date);
    setAttendanceOverrides({});
  };

  const handleSessionSelect = (session: string) => {
    setSessionTime(session);
    setAttendanceOverrides({});
  };

  // Timer countdown for active QR session
  useEffect(() => {
    let interval: any;
    if (qrModalOpen && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [qrModalOpen, timerSeconds]);

  const handleOpenQrModal = () => {
    if (!currentCourse) return;
    const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
    setSessionPin(generatedPin);
    setTimerSeconds(300);
    setCopiedPin(false);

    const activeSession = {
      courseId: currentCourse.id,
      courseCode: currentCourse.code,
      courseTitle: currentCourse.title,
      sessionDate,
      sessionTime,
      pin: generatedPin,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    localStorage.setItem("uninexus_active_attendance_session", JSON.stringify(activeSession));
    setQrModalOpen(true);
  };

  const handleCopyPin = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(sessionPin);
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    }
  };

  // Compute live counters
  const presentCount = Object.values(attendanceState).filter((s) => s === "Present").length;
  const absentCount = Object.values(attendanceState).filter((s) => s === "Absent").length;
  const lateCount = Object.values(attendanceState).filter((s) => s === "Late").length;

  const handleSaveAttendance = async () => {
    if (!currentCourse) return;
    setSaving(true);
    try {
      const recordsToSave: Omit<AttendanceRecord, "id">[] = studentUsers.map((s) => {
        const rawStatus = attendanceState[s.id] || "Present";
        const status = (!isLateAllowed && rawStatus === "Late") ? "Absent" : rawStatus;
        return {
          courseId: currentCourse.id,
          courseCode: currentCourse.code,
          courseTitle: currentCourse.title,
          studentId: s.id,
          studentName: s.name,
          matricNumber: s.identifier,
          date: sessionDate,
          session: sessionTime,
          status,
          lecturerId: user?.id,
          lecturerName: user?.name,
        };
      });

      await saveAttendance(recordsToSave);
      setAttendanceOverrides({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save attendance:", err);
    } finally {
      setSaving(false);
    }
  };

  // Get distinct historical sessions for this course
  const pastSessions = useMemo(() => {
    if (!currentCourse) return [];
    const courseRecords = attendanceRecords.filter(
      (r) => r.courseId === currentCourse.id || r.courseCode === currentCourse.code
    );

    const sessionMap = new Map<string, { date: string; session: string; present: number; total: number }>();

    courseRecords.forEach((r) => {
      const key = `${r.date}_${r.session || "07:30 - 09:30"}`;
      if (!sessionMap.has(key)) {
        sessionMap.set(key, {
          date: r.date,
          session: r.session || "07:30 - 09:30",
          present: 0,
          total: 0,
        });
      }
      const entry = sessionMap.get(key)!;
      entry.total += 1;
      if (r.status.toLowerCase() === "present" || r.status.toLowerCase() === "late") {
        entry.present += 1;
      }
    });

    return Array.from(sessionMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  }, [currentCourse, attendanceRecords]);

  const [classFilter, setClassFilter] = useState<string>("all");

  const filteredStudents = studentUsers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.identifier.toLowerCase().includes(search.toLowerCase());
    const studentClass = s.className || (s.identifier.includes("BA2A") ? "BA2A" : s.identifier.includes("BA2B") ? "BA2B" : "");
    const matchesClass = classFilter === "all" || studentClass === classFilter;
    return matchesSearch && matchesClass;
  });

  const ba2aCount = useMemo(() => studentUsers.filter((s) => (s.className || s.identifier).includes("BA2A")).length, [studentUsers]);
  const ba2bCount = useMemo(() => studentUsers.filter((s) => (s.className || s.identifier).includes("BA2B")).length, [studentUsers]);

  // Loaded past session detail modal state
  const [loadedSessionModalOpen, setLoadedSessionModalOpen] = useState(false);
  const [loadedSessionFilter, setLoadedSessionFilter] = useState<"All" | "Present" | "Absent" | "Late">("All");
  const [loadedSearch, setLoadedSearch] = useState("");
  const [activeLoadedSession, setActiveLoadedSession] = useState<{ date: string; session: string } | null>(null);
  const [loadedSessionBanner, setLoadedSessionBanner] = useState<string | null>(null);

  const handleLoadSession = (date: string, session: string) => {
    handleDateSelect(date);
    handleSessionSelect(session);
    setActiveLoadedSession({ date, session });
    setLoadedSessionFilter("All");
    setLoadedSearch("");
    setLoadedSessionModalOpen(true);
    setLoadedSessionBanner(`Loaded attendance list for ${date} (${session}). Ready for review and editing.`);
  };

  const loadedSessionRecords = useMemo(() => {
    if (!activeLoadedSession || !currentCourse) return [];
    const targetDate = activeLoadedSession.date;
    const targetSession = activeLoadedSession.session;

    const existingForSession = attendanceRecords.filter(
      (r) =>
        (r.courseId === currentCourse.id || r.courseCode === currentCourse.code) &&
        r.date === targetDate &&
        (!r.session || r.session === targetSession || normalizeSession(r.session) === normalizeSession(targetSession))
    );

    return studentUsers.map((s) => {
      const rec = existingForSession.find((r) => r.studentId === s.id);
      const status: AttendanceStatus = rec
        ? rec.status.toLowerCase() === "absent"
          ? "Absent"
          : rec.status.toLowerCase() === "late"
          ? "Late"
          : "Present"
        : "Present";
      return {
        ...s,
        sessionStatus: status,
        remarks: rec?.remarks,
      };
    });
  }, [activeLoadedSession, currentCourse, attendanceRecords, studentUsers]);

  const loadedTotal = loadedSessionRecords.length;
  const loadedPresentCount = loadedSessionRecords.filter((s) => s.sessionStatus === "Present").length;
  const loadedAbsentCount = loadedSessionRecords.filter((s) => s.sessionStatus === "Absent").length;
  const loadedLateCount = loadedSessionRecords.filter((s) => s.sessionStatus === "Late").length;
  const loadedPresentPct = loadedTotal > 0 ? Math.round(((loadedPresentCount + loadedLateCount) / loadedTotal) * 100) : 0;

  const displayedLoadedRecords = useMemo(() => {
    return loadedSessionRecords.filter((s) => {
      const matchesFilter =
        loadedSessionFilter === "All" || s.sessionStatus === loadedSessionFilter;
      const matchesSearch =
        s.name.toLowerCase().includes(loadedSearch.toLowerCase()) ||
        s.identifier.toLowerCase().includes(loadedSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [loadedSessionRecords, loadedSessionFilter, loadedSearch]);

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

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenQrModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition cursor-pointer"
          >
            <QrCode size={16} />
            <span>Generate Session QR & PIN</span>
          </button>

          {/* Course Select Dropdown */}
          <select
            value={selectedCourseId}
            onChange={(e) => handleCourseSelect(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-sky-500 shadow-2xs"
          >
            {myClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Attendance Sheet */}
      <div id="attendance-sheet-table" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        {loadedSessionBanner && (
          <div className="p-3.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sky-900 dark:text-sky-200 font-semibold animate-in fade-in">
            <div className="flex items-center gap-2">
              <CalendarCheck size={16} className="text-sky-600 shrink-0" />
              <span>{loadedSessionBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setLoadedSessionModalOpen(true)}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              View Attendance List
            </button>
          </div>
        )}
        {/* Controls and Stats Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Session Date
              </label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-sky-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Session / Time
                </label>
              </div>
              <select
                value={sessionTime}
                onChange={(e) => handleSessionSelect(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-sky-500"
              >
                {TIMETABLE_PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.period} ({p.label})
                  </option>
                ))}
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
                {isLateAllowed && (
                  <button
                    type="button"
                    onClick={() => handleMarkAll("Late")}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs hover:bg-amber-100 transition border border-amber-200"
                  >
                    All Late
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live Counters */}
          <div className="flex items-center gap-6 bg-slate-50 p-3.5 px-6 rounded-2xl border border-slate-200/60 self-start lg:self-auto">
            <div className="text-center">
              <span className="text-[11px] text-emerald-700 font-bold block">Present</span>
              <span className="text-2xl font-black text-emerald-600">{presentCount}</span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[11px] text-red-700 font-bold block">Absent</span>
              <span className="text-2xl font-black text-red-600">{absentCount}</span>
            </div>
            {isLateAllowed && (
              <>
                <div className="h-8 w-px bg-slate-200" />
                <div className="text-center">
                  <span className="text-[11px] text-amber-700 font-bold block">Late</span>
                  <span className="text-2xl font-black text-amber-600">{lateCount}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search bar & Class Stream Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student by name or ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setClassFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                classFilter === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Students ({studentUsers.length})
            </button>
            <button
              type="button"
              onClick={() => setClassFilter("BA2A")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                classFilter === "BA2A"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-sky-700"
              }`}
            >
              Class BA2A ({ba2aCount})
            </button>
            <button
              type="button"
              onClick={() => setClassFilter("BA2B")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                classFilter === "BA2B"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-indigo-700"
              }`}
            >
              Class BA2B ({ba2bCount})
            </button>
          </div>
        </div>

        {/* Student Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 w-12">#</th>
                <th className="pb-3">Student ID</th>
                <th className="pb-3">Class</th>
                <th className="pb-3">Student Name</th>
                <th className="pb-3 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student, idx) => {
                const currentStatus = attendanceState[student.id] || "Present";
                const studentClass = student.className || (student.identifier.includes("BA2A") ? "BA2A" : student.identifier.includes("BA2B") ? "BA2B" : "BA2A");

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 font-bold text-slate-400 text-xs">{idx + 1}</td>
                    <td className="py-3.5 font-mono font-bold text-sky-700 text-xs">
                      {student.identifier}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider border ${
                        studentClass === "BA2B"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      }`}>
                        {studentClass}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={
                          student.avatar || DEFAULT_AVATARS.student
                        }
                        alt={student.name}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                      <div className="flex items-center gap-1.5">
                        <span>{student.name}</span>
                        {student.hideInfo && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-normal">
                            🔒 Private
                          </span>
                        )}
                      </div>
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
                        {isLateAllowed && (
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
                        )}
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
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 size={16} />
              Attendance Saved & Recorded in Database!
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

      {/* Previous Recorded Sessions Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History size={18} className="text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">
              Previous Attendance Records — {currentCourse?.code}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {pastSessions.length} recorded session(s)
          </span>
        </div>

        {pastSessions.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">
            No previous sessions recorded yet for this course. Save attendance above to create records.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {pastSessions.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CalendarCheck size={14} className="text-sky-600" />
                    {s.date}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Session: {s.session} • {s.present}/{s.total} present (
                    {Math.round((s.present / (s.total || 1)) * 100)}%)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLoadSession(s.date, s.session)}
                  className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-sky-50 text-sky-700 border border-slate-200 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Edit3 size={12} />
                  Load
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= DYNAMIC QR CODE & PIN MODAL ================= */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="Live Lecture Attendance Check-In"
      >
        <div className="space-y-5 text-center">
          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800">
            <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
              {currentCourse?.title} ({currentCourse?.code})
            </h3>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
              {sessionDate} • {sessionTime} Session • Lecturer: {user?.name || "Lecturer"}
            </p>
          </div>

          {/* SVG QR Code Simulation */}
          <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 shadow-inner">
            <div className="w-56 h-56 bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center relative">
              {/* Scalable Vector Graphic QR Matrix */}
              <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-900">
                {/* Top-Left Position Square */}
                <rect x="5" y="5" width="28" height="28" fill="#1e1b4b" rx="4" />
                <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="13" width="12" height="12" fill="#4f46e5" rx="1.5" />

                {/* Top-Right Position Square */}
                <rect x="67" y="5" width="28" height="28" fill="#1e1b4b" rx="4" />
                <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="75" y="13" width="12" height="12" fill="#4f46e5" rx="1.5" />

                {/* Bottom-Left Position Square */}
                <rect x="5" y="67" width="28" height="28" fill="#1e1b4b" rx="4" />
                <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="75" width="12" height="12" fill="#4f46e5" rx="1.5" />

                {/* Simulated Data Pattern Matrix */}
                <rect x="38" y="8" width="8" height="8" />
                <rect x="50" y="8" width="6" height="6" />
                <rect x="40" y="20" width="6" height="6" />
                <rect x="52" y="18" width="8" height="8" />
                <rect x="10" y="38" width="8" height="6" />
                <rect x="22" y="42" width="6" height="8" />
                <rect x="38" y="38" width="10" height="10" fill="#4f46e5" />
                <rect x="54" y="36" width="6" height="6" />
                <rect x="68" y="40" width="8" height="6" />
                <rect x="82" y="38" width="8" height="8" />
                <rect x="42" y="52" width="6" height="8" />
                <rect x="56" y="50" width="10" height="8" />
                <rect x="70" y="52" width="8" height="6" />
                <rect x="84" y="54" width="6" height="8" />
                <rect x="38" y="68" width="8" height="8" />
                <rect x="50" y="68" width="6" height="6" />
                <rect x="68" y="68" width="6" height="8" />
                <rect x="78" y="72" width="8" height="8" />
                <rect x="40" y="82" width="6" height="8" />
                <rect x="52" y="80" width="8" height="8" />
                <rect x="66" y="84" width="10" height="6" fill="#4f46e5" />
                <rect x="82" y="86" width="6" height="6" />
              </svg>

              {/* Center Logo Icon */}
              <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-xl shadow-lg border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Smartphone size={20} />
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              <Clock size={13} className="animate-spin" />
              <span>
                Code expires in: {Math.floor(timerSeconds / 60)}:
                {(timerSeconds % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* 6-Digit Session PIN Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Class Session PIN
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-indigo-600 dark:text-indigo-400">
                {sessionPin}
              </span>
              <button
                type="button"
                onClick={handleCopyPin}
                className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition shadow-xs cursor-pointer"
                title="Copy PIN"
              >
                {copiedPin ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Project this screen in your classroom. Students open their <strong>Student Attendance</strong> tab and enter this 6-digit PIN to check in automatically.
          </p>

          <button
            type="button"
            onClick={() => setQrModalOpen(false)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Done / Close QR Code
          </button>
        </div>
      </Modal>

      {/* ================= LOADED SESSION ATTENDANCE LIST MODAL ================= */}
      <Modal
        isOpen={loadedSessionModalOpen}
        onClose={() => setLoadedSessionModalOpen(false)}
        title={`Attendance Records — ${activeLoadedSession?.date || sessionDate}`}
        subtitle={`${currentCourse?.code} • ${currentCourse?.title} • Session ${activeLoadedSession?.session || sessionTime}`}
        maxWidth="2xl"
      >
        <div className="space-y-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Students
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {loadedTotal}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Present
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300">
                {loadedPresentCount} ({loadedPresentPct}%)
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                Absent
              </span>
              <span className="text-base sm:text-lg font-black text-red-700 dark:text-red-300">
                {loadedAbsentCount}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Late
              </span>
              <span className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-300">
                {loadedLateCount}
              </span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(["All", "Present", "Absent", "Late"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setLoadedSessionFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    loadedSessionFilter === tab
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or matric..."
                value={loadedSearch}
                onChange={(e) => setLoadedSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none w-full sm:w-56"
              />
            </div>
          </div>

          {/* Students Attendance List Table */}
          <div className="max-h-[380px] overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
                <tr className="text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Student</th>
                  <th className="p-3">Matricule</th>
                  <th className="p-3 text-center">Class</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayedLoadedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                      No student records match this filter.
                    </td>
                  </tr>
                ) : (
                  displayedLoadedRecords.map((s) => {
                    const stuClass = s.className || (s.identifier.includes("BA2A") ? "BA2A" : s.identifier.includes("BA2B") ? "BA2B" : "BA2");
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 flex items-center gap-2.5 font-bold text-slate-900 dark:text-slate-100">
                          <img
                            src={s.avatar || DEFAULT_AVATARS.student}
                            alt={s.name}
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p>{s.name}</p>
                            {s.hideInfo && (
                              <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-normal">
                                🔒 Private
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-mono font-bold text-sky-700 dark:text-sky-400">
                          {s.identifier}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                            stuClass === "BA2B"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-sky-50 text-sky-700 border-sky-200"
                          }`}>
                            {stuClass}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                              s.sessionStatus === "Present"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                                : s.sessionStatus === "Absent"
                                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                            }`}
                          >
                            {s.sessionStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setLoadedSessionModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                setLoadedSessionModalOpen(false);
                const el = document.getElementById("attendance-sheet-table");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 size={14} />
              Edit / Update in Sheet
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

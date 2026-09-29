import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  QrCode,
  KeyRound,
  Upload,
  FileText,
  Calendar,
  User,
  X,
  PlusCircle,
  Download,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import type { AttendanceRecord, AbsenceJustification } from "../../types";

export const StudentAttendance: React.FC = () => {
  const { user } = useAuth();
  const { attendanceRecords, courses, enrollments, justifications, saveAttendance, submitJustification } = useData();
  const { isDark } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab: "records" (attendance log & progress) or "justifications" (absence justifications manager)
  const [activeTab, setActiveTab] = useState<"records" | "justifications">(() => {
    return searchParams.get("tab") === "justifications" ? "justifications" : "records";
  });

  // PIN / QR Check-In Modal
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInResult, setCheckInResult] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  // Absence Justification States
  const [selectedAbsenceForJustify, setSelectedAbsenceForJustify] = useState<AttendanceRecord | null>(null);
  const [justifyModalOpen, setJustifyModalOpen] = useState(false);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [selectedJustification, setSelectedJustification] = useState<AbsenceJustification | null>(null);
  const [submittedSuccessModalOpen, setSubmittedSuccessModalOpen] = useState(false);

  // Form State for Justification
  const [justReason, setJustReason] = useState("");
  const [justComment, setJustComment] = useState("");
  const [justFile, setJustFile] = useState<File | null>(null);
  const [justFileError, setJustFileError] = useState("");
  const [justFormError, setJustFormError] = useState("");
  const [submittingJustification, setSubmittingJustification] = useState(false);
  const [justSuccessBanner, setJustSuccessBanner] = useState("");

  const studentId = user?.id || "";

  const isMe = (item: { studentId?: string; matricNumber?: string; studentName?: string }) => {
    if (!item) return false;
    if (studentId && (item.studentId === studentId || String(item.studentId) === String(studentId))) return true;
    if (user?.identifier && item.matricNumber && item.matricNumber.trim().toUpperCase() === user.identifier.trim().toUpperCase()) return true;
    if (user?.name && item.studentName && item.studentName.trim().toUpperCase() === user.name.trim().toUpperCase()) return true;
    return false;
  };

  // Filter attendance records strictly for this student
  const myAttendanceRecords = useMemo(() => {
    return attendanceRecords.filter((r) => isMe(r));
  }, [attendanceRecords, studentId, user]);

  // Registered courses or courses with attendance records
  const studentEnrollments = useMemo(() => {
    return enrollments.filter(
      (e) =>
        (e.studentId === studentId ||
         (user?.identifier && (e as any).matricNumber === user.identifier)) &&
        e.status === "registered"
    );
  }, [enrollments, studentId, user]);

  // Justifications matching this student
  const myJustifications = useMemo(() => {
    return justifications.filter((j) => isMe(j));
  }, [justifications, studentId, user]);

  // Absences matching this student
  const myAbsences = useMemo(() => {
    return myAttendanceRecords.filter((r) => r.status.toLowerCase() === "absent");
  }, [myAttendanceRecords]);

  // Helper: Match absence to justification
  const getJustificationForAbsence = (absence: AttendanceRecord): AbsenceJustification | undefined => {
    return justifications.find(
      (j) => (j.absenceId === absence.id || j.id === absence.justificationId) && isMe(j)
    );
  };

  // Absences that still require justification (either no justification or rejected)
  const unjustifiedAbsences = useMemo(() => {
    return myAbsences.filter((a) => {
      const just = getJustificationForAbsence(a);
      return !just || just.status === "NOT_JUSTIFIED" || just.status === "REJECTED";
    });
  }, [myAbsences, justifications]);

  // Compute course-by-course stats
  const courseStats = useMemo(() => {
    let targetCourses: { courseCode: string; courseTitle: string; courseId?: string; lecturer: string }[] = [];

    if (studentEnrollments.length > 0) {
      targetCourses = studentEnrollments.map((enr) => {
        const course = courses.find((c) => c.id === enr.courseId || c.code === enr.courseCode);
        return {
          courseId: enr.courseId,
          courseCode: enr.courseCode,
          courseTitle: enr.courseTitle,
          lecturer: course?.lecturerName || "Faculty Instructor",
        };
      });
    } else {
      const map = new Map<string, { courseCode: string; courseTitle: string; courseId?: string; lecturer: string }>();
      myAttendanceRecords.forEach((r) => {
        const code = r.courseCode || "CS 101";
        if (!map.has(code)) {
          const course = courses.find((c) => c.code === code || c.id === r.courseId);
          map.set(code, {
            courseId: r.courseId || course?.id,
            courseCode: code,
            courseTitle: r.courseTitle || course?.title || code,
            lecturer: r.lecturerName || course?.lecturerName || "Faculty Instructor",
          });
        }
      });
      if (map.size > 0) {
        targetCourses = Array.from(map.values());
      } else {
        targetCourses = courses.slice(0, 4).map((c) => ({
          courseId: c.id,
          courseCode: c.code,
          courseTitle: c.title,
          lecturer: c.lecturerName || "Faculty Instructor",
        }));
      }
    }

    return targetCourses.map((enr) => {
      const records = myAttendanceRecords.filter(
        (r) => r.courseCode === enr.courseCode || (enr.courseId && r.courseId === enr.courseId)
      );

      const totalClasses = records.length;
      const presentCount = records.filter((r) => r.status.toLowerCase() === "present").length;
      const lateCount = records.filter((r) => r.status.toLowerCase() === "late").length;
      const excusedCount = records.filter((r) => r.status.toLowerCase() === "excused" || r.absenceStatus === "EXCUSED").length;
      const absentCount = records.filter((r) => r.status.toLowerCase() === "absent" && r.absenceStatus !== "EXCUSED").length;

      const attended = presentCount + lateCount + excusedCount;
      const percentage = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0;
      const isWarning = totalClasses > 0 && percentage < 75;

      return {
        courseCode: enr.courseCode,
        courseTitle: enr.courseTitle,
        lecturer: enr.lecturer,
        totalClasses,
        attendedClasses: attended,
        presentCount,
        lateCount,
        excusedCount,
        absentCount,
        percentage,
        isWarning,
      };
    });
  }, [studentEnrollments, courses, myAttendanceRecords]);

  // Overall attendance calculation
  const totalClassesCount = myAttendanceRecords.length;
  const totalPresent = myAttendanceRecords.filter((r) => r.status.toLowerCase() === "present").length;
  const totalAbsent = myAttendanceRecords.filter((r) => r.status.toLowerCase() === "absent").length;
  const totalLate = myAttendanceRecords.filter((r) => r.status.toLowerCase() === "late").length;
  const totalExcused = myAttendanceRecords.filter((r) => r.status.toLowerCase() === "excused" || r.absenceStatus === "EXCUSED").length;

  const totalPositive = totalPresent + totalLate + totalExcused;
  const overallPercentage =
    totalClassesCount > 0
      ? Math.round((totalPositive / totalClassesCount) * 100)
      : null;

  const lowAttendanceCount = courseStats.filter((c) => c.isWarning).length;

  // Handlers for Check-In
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPin.trim()) return;
    setCheckingIn(true);
    setCheckInResult({ type: "idle", message: "" });

    try {
      let targetCourse = courses[0];
      let sessionName = "Morning";
      const rawSession = localStorage.getItem("uninexus_active_attendance_session");
      if (rawSession) {
        try {
          const parsed = JSON.parse(rawSession);
          if (parsed.pin === enteredPin.trim() || enteredPin.trim().length === 6) {
            const found = courses.find((c) => c.id === parsed.courseId || c.code === parsed.courseCode);
            if (found) targetCourse = found;
            if (parsed.sessionTime) sessionName = parsed.sessionTime;
          }
        } catch {
          // ignore
        }
      }

      const todayDate = new Date().toISOString().split("T")[0];
      const newRecord = {
        courseId: targetCourse.id,
        courseCode: targetCourse.code,
        courseTitle: targetCourse.title,
        studentId: user?.id || "",
        studentName: user?.name || "Student",
        matricNumber: user?.identifier || "STU-001",
        date: todayDate,
        session: sessionName as any,
        status: "Present" as any,
        lecturerName: targetCourse.lecturerName,
      };

      await saveAttendance([newRecord]);
      setCheckInResult({
        type: "success",
        message: `Attendance confirmed! You are registered as PRESENT for ${targetCourse.title} (${targetCourse.code}) on ${todayDate}.`,
      });
      setEnteredPin("");
      setTimeout(() => {
        setCheckInModalOpen(false);
        setCheckInResult({ type: "idle", message: "" });
      }, 2500);
    } catch (err: any) {
      setCheckInResult({
        type: "error",
        message: err.message || "Failed to confirm attendance. Please verify your PIN.",
      });
    } finally {
      setCheckingIn(false);
    }
  };

  // Handlers for Absence Justification
  const handleOpenJustifyModal = (absence?: AttendanceRecord) => {
    if (absence) {
      const existing = getJustificationForAbsence(absence);
      if (existing && (existing.status === "PENDING" || existing.status === "APPROVED")) {
        setSelectedJustification(existing);
        setViewDetailsModalOpen(true);
        return;
      }
      setSelectedAbsenceForJustify(absence);
    } else {
      setSelectedAbsenceForJustify(unjustifiedAbsences[0] || myAbsences[0] || null);
    }

    setJustReason("");
    setJustComment("");
    setJustFile(null);
    setJustFileError("");
    setJustFormError("");
    setJustifyModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJustFileError("");
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
      const ext = selectedFile.name.split(".").pop()?.toLowerCase();

      if (!ext || !allowedExtensions.includes(ext)) {
        setJustFileError("Invalid format. Please upload a PDF, JPG, JPEG, or PNG file.");
        setJustFile(null);
        return;
      }

      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
      if (selectedFile.size > MAX_SIZE) {
        setJustFileError("File exceeds maximum allowed size of 5 MB.");
        setJustFile(null);
        return;
      }

      setJustFile(selectedFile);
    }
  };

  const handleSubmitJustification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAbsenceForJustify) {
      setJustFormError("Please select the absence record to justify.");
      return;
    }

    if (!justReason.trim()) {
      setJustFormError("Please provide a valid reason for your absence.");
      return;
    }

    if (!justFile) {
      setJustFileError("Supporting document (medical certificate, official letter) is required.");
      return;
    }

    setSubmittingJustification(true);
    setJustFormError("");

    try {
      const readFileAsDataUrl = (f: File): Promise<string> =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve(URL.createObjectURL(f));
          reader.readAsDataURL(f);
        });

      const docDataUrl = await readFileAsDataUrl(justFile);

      await submitJustification({
        absenceId: selectedAbsenceForJustify.id,
        studentId: user?.id || "",
        studentName: user?.name || "Student",
        studentMatric: user?.identifier || "STU-001",
        studentAvatar: user?.avatar,
        courseId: selectedAbsenceForJustify.courseId,
        courseCode: selectedAbsenceForJustify.courseCode,
        courseTitle: selectedAbsenceForJustify.courseTitle || selectedAbsenceForJustify.courseCode,
        lecturerId: selectedAbsenceForJustify.lecturerId || "usr-teacher-tchoutouo",
        lecturerName: selectedAbsenceForJustify.lecturerName || "Mrs. TCHOUTOUO",
        absenceDate: selectedAbsenceForJustify.date,
        reason: justReason.trim(),
        comment: justComment.trim(),
        documentUrl: docDataUrl,
        documentName: justFile.name,
        documentType: justFile.type || justFile.name.split(".").pop() || "application/pdf",
        documentSize: justFile.size,
      });

      setJustifyModalOpen(false);
      setSubmittedSuccessModalOpen(true);
      setJustSuccessBanner(
        `Absence justification for ${selectedAbsenceForJustify.courseCode} (${selectedAbsenceForJustify.date}) submitted successfully!`
      );
      setTimeout(() => setJustSuccessBanner(""), 8000);
    } catch (err: any) {
      setJustFormError(err.message || "Failed to submit absence justification.");
    } finally {
      setSubmittingJustification(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            My Attendance & Justifications
          </h1>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"} mt-1`}>
            Track lecture attendance, check percentage eligibility, and submit absence justifications directly
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {unjustifiedAbsences.length > 0 && (
            <button
              type="button"
              onClick={() => handleOpenJustifyModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-none transition cursor-pointer"
            >
              <FileCheck size={16} />
              <span>Justify Absence ({unjustifiedAbsences.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setEnteredPin("");
              setCheckInResult({ type: "idle", message: "" });
              setCheckInModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-200 dark:shadow-none transition cursor-pointer"
          >
            <QrCode size={16} />
            <span>⚡ QR / PIN Check-In</span>
          </button>
        </div>
      </div>

      {/* Justification Success Notification Banner */}
      {justSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold">{justSuccessBanner}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Your lecturer and the administration will review your supporting document.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setJustSuccessBanner("")}
            className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 rounded-lg transition"
            title="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Warning Notice if any course < 75% */}
      {lowAttendanceCount > 0 && (
        <div
          className={`border rounded-2xl p-5 flex items-start gap-4 transition ${
            isDark ? "bg-amber-900/20 border-amber-800" : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">Attendance Warning Alert</h4>
            <p className="text-xs text-amber-800 dark:text-amber-400 mt-1 leading-relaxed">
              You have <strong>{lowAttendanceCount} course(s)</strong> below the institutional 75%
              minimum attendance threshold. If absences were due to medical or official reasons, submit
              an <strong>Absence Justification</strong> with supporting documents directly below to protect your exam eligibility.
            </p>
          </div>
          {unjustifiedAbsences.length > 0 && (
            <button
              type="button"
              onClick={() => handleOpenJustifyModal()}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer self-center"
            >
              Justify Now
            </button>
          )}
        </div>
      )}

      {/* Attendance Metrics Grid - Structured matching Grid Layout without icons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grid Item 2 (Top Across): Total Classes & Academic Sessions */}
        <div
          className={`md:col-span-2 rounded-2xl p-5 border shadow-xs transition-all duration-200 ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Total Classes Recorded
              </p>
              <div className="flex items-baseline gap-3 mt-1.5">
                <span
                  className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {totalClassesCount}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isDark ? "bg-sky-950/60 text-sky-400 border border-sky-800" : "bg-sky-50 text-sky-700 border border-sky-200"
                  }`}
                >
                  {totalClassesCount === 1 ? "1 Recorded Session" : `${totalClassesCount} Recorded Sessions`}
                </span>
              </div>
              <p className={`text-xs mt-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Total scheduled & recorded lectures across all your enrolled courses this semester
              </p>
            </div>
            <div
              className={`flex items-center gap-4 text-xs font-semibold px-4 py-2.5 rounded-xl self-start sm:self-center border ${
                isDark ? "bg-slate-800/80 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <div>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mr-1">{totalPresent}</span> Present
              </div>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <div>
                <span className="text-amber-600 dark:text-amber-400 font-bold text-sm mr-1">{totalLate}</span> Late
              </div>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <div>
                <span className="text-rose-600 dark:text-rose-400 font-bold text-sm mr-1">{unjustifiedAbsences.length}</span> Unexcused
              </div>
            </div>
          </div>
        </div>

        {/* Grid Item 1 (Tall Hero Card on Left): Overall Attendance Rate */}
        <div
          className={`md:col-start-1 md:row-start-2 md:row-span-2 rounded-2xl p-6 sm:p-7 border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Overall Attendance
              </p>
              {overallPercentage !== null ? (
                overallPercentage >= 75 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Eligible (≥ 75%)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    At Risk (&lt; 75%)
                  </span>
                )
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  No Records
                </span>
              )}
            </div>

            {/* Huge Value Display */}
            <div className="my-6">
              <div
                className={`text-5xl sm:text-6xl font-black tracking-tight ${
                  overallPercentage !== null
                    ? overallPercentage >= 75
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                    : isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {overallPercentage !== null ? `${overallPercentage}%` : "N/A"}
              </div>

              {/* High-Fidelity Visual Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 mt-5 overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    overallPercentage !== null && overallPercentage >= 75
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : "bg-gradient-to-r from-rose-500 to-amber-500"
                  }`}
                  style={{ width: `${Math.min(overallPercentage || 0, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs mt-2.5 font-medium">
                <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                  <strong>{totalPositive}</strong> attended out of <strong>{totalClassesCount}</strong> sessions
                </span>
                <span className="text-slate-400 font-semibold">Min 75% for Exams</span>
              </div>
            </div>
          </div>

          <div
            className={`pt-4 border-t text-xs leading-relaxed ${
              isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
            }`}
          >
            {overallPercentage !== null && overallPercentage < 75 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                ⚠️ Attendance is below the institutional 75% threshold. Ensure you submit justifications for any missed lectures.
              </span>
            ) : (
              <span>
                Consistent lecture presence satisfies university examination eligibility requirements.
              </span>
            )}
          </div>
        </div>

        {/* Grid Item 3 (Top Right): Present */}
        <div
          className={`md:col-start-2 md:row-start-2 rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
          }`}
        >
          <div>
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Present
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {totalPresent}
              </h3>
            </div>
            <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              On-time presence recorded
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {totalClassesCount > 0
              ? `${Math.round((totalPresent / totalClassesCount) * 100)}% of total sessions`
              : "No sessions recorded"}
          </div>
        </div>

        {/* Grid Item 4 (Middle Right): Late / Tardy */}
        <div
          className={`md:col-start-2 md:row-start-3 rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
          }`}
        >
          <div>
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Late / Tardy
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-amber-500 dark:text-amber-400">
                {totalLate}
              </h3>
            </div>
            <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Arrivals marked after lecture start
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-amber-600 dark:text-amber-400">
            {totalLate > 0 ? "Credited towards total positive attendance" : "Zero late arrivals recorded"}
          </div>
        </div>

        {/* Grid Item 5 (Bottom Left): Unexcused */}
        <div
          className={`md:col-start-1 md:row-start-4 rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Unexcused Absences
              </p>
              {unjustifiedAbsences.length > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                  Action Required
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">
                {unjustifiedAbsences.length}
              </h3>
            </div>
            <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {unjustifiedAbsences.length > 0
                ? "Absences requiring formal justification"
                : "No unexcused absences recorded"}
            </p>
          </div>
          {unjustifiedAbsences.length > 0 ? (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleOpenJustifyModal()}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 cursor-pointer flex items-center gap-1 transition"
              >
                <span>Submit justification now</span>
                <span>&rarr;</span>
              </button>
            </div>
          ) : (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400">
              All records in good standing
            </div>
          )}
        </div>

        {/* Grid Item 6 (Bottom Right): Excused Absences */}
        <div
          className={`md:col-start-2 md:row-start-4 rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
          }`}
        >
          <div>
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Excused Absences
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
                {totalExcused}
              </h3>
            </div>
            <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Official justifications approved by administration
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {totalExcused > 0
              ? `${totalExcused} approved justification document(s)`
              : "No excused absences"}
          </div>
        </div>
      </div>

      {/* Segmented View Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab("records");
            setSearchParams({});
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === "records"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          }`}
        >
          <CalendarCheck size={16} />
          <span>Attendance Records & Breakdown</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("justifications");
            setSearchParams({ tab: "justifications" });
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === "justifications"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          }`}
        >
          <FileCheck size={16} />
          <span>Absence Justifications</span>
          {myJustifications.length > 0 && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeTab === "justifications"
                  ? "bg-white text-indigo-700"
                  : "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300"
              }`}
            >
              {myJustifications.length}
            </span>
          )}
        </button>
      </div>

      {/* ================= TAB 1: ATTENDANCE RECORDS & PROGRESS ================= */}
      {activeTab === "records" && (
        <div className="space-y-6">
          {/* Course-by-Course Attendance Progress */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Course Attendance Breakdown
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current attendance rates for all registered semester courses
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {courseStats.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs">
                  <CalendarCheck className="mx-auto mb-2 text-indigo-500 opacity-70" size={24} />
                  No registered courses found for attendance tracking.
                </div>
              ) : (
                courseStats.map((item) => (
                  <div
                    key={item.courseCode}
                    className={`p-5 rounded-2xl border transition ${
                      item.isWarning
                        ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                            {item.courseCode}
                          </span>
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {item.courseTitle}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Lecturer: {item.lecturer} • Attended: {item.attendedClasses} of {item.totalClasses} classes
                          {item.excusedCount > 0 && ` (${item.excusedCount} excused)`}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 self-start sm:self-auto">
                        <div className="text-right">
                          <span
                            className={`text-xl font-extrabold ${
                              item.isWarning ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"
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
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            item.isWarning ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detailed Attendance History Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Attendance Log & History
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Individual class attendance records logged by your course lecturers with direct justification actions
                </p>
              </div>

              {unjustifiedAbsences.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleOpenJustifyModal()}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 transition self-start sm:self-auto cursor-pointer"
                >
                  <PlusCircle size={15} />
                  <span>Justify An Absence</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Course / Subject</th>
                    <th className="pb-3">Session</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Remarks / Review</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myAttendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                        No attendance records logged yet. Records will appear here as your lecturers mark attendance.
                      </td>
                    </tr>
                  ) : (
                    myAttendanceRecords.map((r) => {
                      const statusLower = r.status.toLowerCase();
                      const isAbsent = statusLower === "absent";
                      const isLate = statusLower === "late";
                      const isExcused = statusLower === "excused" || r.absenceStatus === "EXCUSED";
                      const isPresent = statusLower === "present";

                      const just = getJustificationForAbsence(r);

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                          <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                            {r.date}
                          </td>
                          <td className="py-3.5 text-xs">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{r.courseCode}</span>
                            {r.courseTitle && (
                              <span className="text-slate-400 ml-1.5 text-[11px]">— {r.courseTitle}</span>
                            )}
                          </td>
                          <td className="py-3.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {r.session || "Morning"}
                          </td>
                          <td className="py-3.5 text-xs">
                            {isPresent && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <CheckCircle2 size={12} />
                                PRESENT
                              </span>
                            )}
                            {isLate && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                <Clock size={12} />
                                LATE
                              </span>
                            )}
                            {isExcused && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                                <ShieldCheck size={12} />
                                EXCUSED
                              </span>
                            )}
                            {isAbsent && !isExcused && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                                <XCircle size={12} />
                                ABSENT
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-xs text-slate-500 dark:text-slate-400">
                            {just?.status === "PENDING" ? (
                              <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                                <Clock size={12} /> Justification Pending Review
                              </span>
                            ) : just?.status === "APPROVED" ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 size={12} /> Justification Approved
                              </span>
                            ) : just?.status === "REJECTED" ? (
                              <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                                <XCircle size={12} /> Justification Rejected
                              </span>
                            ) : (
                              r.remarks || "—"
                            )}
                          </td>
                          <td className="py-3.5 text-right">
                            {isAbsent && !isExcused && (!just || just.status === "NOT_JUSTIFIED") ? (
                              <button
                                type="button"
                                onClick={() => handleOpenJustifyModal(r)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-[11px] shadow-xs transition cursor-pointer"
                              >
                                <FileCheck size={13} />
                                <span>Justify Absence</span>
                              </button>
                            ) : just?.status === "PENDING" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedJustification(just);
                                  setViewDetailsModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-[11px] hover:bg-blue-100 dark:hover:bg-blue-900/40 transition cursor-pointer"
                              >
                                <Clock size={12} />
                                <span>Pending (View)</span>
                              </button>
                            ) : isExcused && just ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedJustification(just);
                                  setViewDetailsModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[11px] hover:bg-emerald-100 transition cursor-pointer"
                              >
                                <ShieldCheck size={12} />
                                <span>Excused (Details)</span>
                              </button>
                            ) : just?.status === "REJECTED" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedJustification(just);
                                    setViewDetailsModalOpen(true);
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition cursor-pointer"
                                >
                                  Reason
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenJustifyModal(r)}
                                  className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
                                >
                                  Resubmit
                                </button>
                              </div>
                            ) : isExcused ? (
                              <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                                <CheckCircle2 size={13} />
                                Excused
                              </span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ABSENCE JUSTIFICATIONS MANAGER ================= */}
      {activeTab === "justifications" && (
        <div className="space-y-6">
          {/* Top Banner Card */}
          <div className="bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-900/40 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
                  <FileCheck size={14} />
                  Absence Justifications Portal
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Official Absence Submissions
                </h2>
                <p className="text-indigo-100 text-sm mt-1 max-w-xl">
                  Upload medical certificates, hospital receipts, or official university excuses. Reviewer status updates in real-time.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
                  <p className="text-2xl font-black">{myAbsences.length}</p>
                  <p className="text-[11px] uppercase font-bold text-indigo-200">Total Absences</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
                  <p className="text-2xl font-black">
                    {myAbsences.filter((a) => getJustificationForAbsence(a)?.status === "APPROVED").length}
                  </p>
                  <p className="text-[11px] uppercase font-bold text-indigo-200">Excused</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action prompt if there are unjustified absences */}
          {unjustifiedAbsences.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                    You have {unjustifiedAbsences.length} unexcused absence(s) awaiting justification
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                    Submit valid documentation within 48 hours of your missed class to obtain an official excuse.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenJustifyModal()}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <PlusCircle size={15} />
                <span>Submit Justification</span>
              </button>
            </div>
          )}

          {/* Justifications Table Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Recorded Absences & Review Status
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  List of all missed class sessions and their corresponding justification status
                </p>
              </div>

              {unjustifiedAbsences.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleOpenJustifyModal()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle size={14} />
                  <span>Justify Absence</span>
                </button>
              )}
            </div>

            {myAbsences.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-bold text-slate-700 dark:text-slate-300">Perfect Attendance Record!</p>
                <p className="text-xs mt-1">You have zero recorded absences on file.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Date of Absence</th>
                      <th className="px-6 py-4">Course / Class</th>
                      <th className="px-6 py-4">Lecturer</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Document</th>
                      <th className="px-6 py-4">Submitted On</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {myAbsences.map((absence) => {
                      const just = getJustificationForAbsence(absence);
                      const isUnjustified = !just || just.status === "NOT_JUSTIFIED";
                      const isPending = just?.status === "PENDING";
                      const isApproved = just?.status === "APPROVED";
                      const isRejected = just?.status === "REJECTED";

                      return (
                        <tr key={absence.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar size={15} className="text-slate-400" />
                              <span>{absence.date}</span>
                              <span className="text-xs text-slate-400">({absence.session})</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">
                              {absence.courseCode}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block truncate max-w-xs">
                              {absence.courseTitle || "Course Lecture"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <User size={14} className="text-slate-400" />
                              <span>{absence.lecturerName || "Faculty Instructor"}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {isUnjustified ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <AlertCircle size={13} />
                                UNJUSTIFIED
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                <Clock size={13} />
                                PENDING
                              </span>
                            ) : isApproved ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle2 size={13} />
                                EXCUSED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800">
                                <XCircle size={13} />
                                REJECTED
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            {just?.documentName ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedJustification(just);
                                  setViewDetailsModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                              >
                                <FileText size={14} />
                                <span className="truncate max-w-[120px]">{just.documentName}</span>
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 italic">None attached</span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {just?.submittedAt || "—"}
                          </td>

                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            {isUnjustified ? (
                              <button
                                type="button"
                                onClick={() => handleOpenJustifyModal(absence)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <PlusCircle size={14} />
                                Justify Absence
                              </button>
                            ) : isRejected ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedJustification(just);
                                    setViewDetailsModalOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
                                >
                                  Reason
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenJustifyModal(absence)}
                                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                                >
                                  Resubmit
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedJustification(just);
                                  setViewDetailsModalOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
                              >
                                View Details
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attendance Policy Card */}
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 flex items-start gap-4 text-xs text-slate-600 dark:text-slate-300">
        <Info size={20} className="text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">University Attendance & Justification Regulations</h4>
          <p className="leading-relaxed">
            1. Students must attend a minimum of 75% of all scheduled lectures, tutorials, and laboratories to qualify for examinations.
          </p>
          <p className="leading-relaxed">
            2. Medical certificates or emergency justifications must be submitted directly here within 48 hours of the missed lecture.
          </p>
          <p className="leading-relaxed">
            3. Approved justifications automatically excuse your absence and safeguard your attendance standing.
          </p>
        </div>
      </div>

      {/* ================= STUDENT CHECK-IN MODAL ================= */}
      <Modal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        title="Lecture Attendance Self Check-In"
      >
        <form onSubmit={handleCheckIn} className="space-y-5">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-inner">
              <QrCode size={28} />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Verify Lecture Attendance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter the 6-digit session PIN displayed on your lecturer's screen to record your presence for today.
            </p>
          </div>

          {checkInResult.message && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                checkInResult.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
              }`}
            >
              {checkInResult.type === "success" ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle size={16} className="text-red-600 shrink-0" />
              )}
              <span>{checkInResult.message}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 text-center">
              6-Digit Session PIN
            </label>
            <div className="relative max-w-xs mx-auto">
              <KeyRound
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                maxLength={6}
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-center text-xl font-mono font-black tracking-widest text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 transition"
              />
            </div>

            {/* Quick Demo Assist */}
            <div className="text-center mt-2.5">
              <span className="text-[11px] text-slate-400">Quick Demo PIN: </span>
              <button
                type="button"
                onClick={() => setEnteredPin("849201")}
                className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Use Active PIN (849201)
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCheckInModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={checkingIn || enteredPin.length < 6}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-200 dark:shadow-none transition disabled:opacity-50 cursor-pointer"
            >
              {checkingIn ? "Verifying..." : "Confirm Presence"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= SUBMIT ABSENCE JUSTIFICATION MODAL ================= */}
      <Modal
        isOpen={justifyModalOpen}
        onClose={() => setJustifyModalOpen(false)}
        title="Submit Absence Justification"
      >
        <form onSubmit={handleSubmitJustification} className="space-y-4">
          {/* Absence Record Selection / Summary */}
          {selectedAbsenceForJustify ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Absence Date:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedAbsenceForJustify.date} ({selectedAbsenceForJustify.session})
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Course:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedAbsenceForJustify.courseCode} - {selectedAbsenceForJustify.courseTitle || "Course"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Lecturer:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedAbsenceForJustify.lecturerName || "Faculty Instructor"}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Select Absence Session to Justify <span className="text-red-500">*</span>
              </label>
              <select
                value=""
                onChange={(e) => {
                  const found = myAbsences.find((a) => a.id === e.target.value);
                  if (found) setSelectedAbsenceForJustify(found);
                }}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="" disabled>-- Select a missed class session --</option>
                {(unjustifiedAbsences.length > 0 ? unjustifiedAbsences : myAbsences).map((abs) => (
                  <option key={abs.id} value={abs.id}>
                    {abs.date} — {abs.courseCode} ({abs.session})
                  </option>
                ))}
              </select>
            </div>
          )}

          {justFormError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
              {justFormError}
            </div>
          )}

          {/* Reason Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Reason for Absence <span className="text-red-500">*</span>
            </label>
            <textarea
              value={justReason}
              onChange={(e) => setJustReason(e.target.value)}
              placeholder="Explain why you missed this class (e.g. medical illness, doctor visit, hospitalization, family bereavement, official university event)..."
              rows={3}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition"
            />
          </div>

          {/* Optional Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Additional Notes / Remarks (Optional)
            </label>
            <input
              type="text"
              value={justComment}
              onChange={(e) => setJustComment(e.target.value)}
              placeholder="e.g. Medical certificate from Dr. Williams attached"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition"
            />
          </div>

          {/* Supporting Document Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Supporting Document (Medical Cert / Letter) <span className="text-red-500">*</span>
            </label>

            {!justFile ? (
              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/30 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Upload size={22} />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Click to browse or drag file here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Allowed formats: PDF, JPG, JPEG, PNG (Max size: 5 MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {justFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {formatFileSize(justFile.size)} • {justFile.type || "Document"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setJustFile(null)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {justFileError && (
              <p className="text-xs text-red-600 font-semibold mt-1.5">{justFileError}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setJustifyModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingJustification}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs transition shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submittingJustification ? "Submitting..." : "Submit Justification"}
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= VIEW JUSTIFICATION DETAILS MODAL ================= */}
      <Modal
        isOpen={viewDetailsModalOpen}
        onClose={() => setViewDetailsModalOpen(false)}
        title="Absence Justification Details"
      >
        {selectedJustification && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">
                  Course & Date
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedJustification.courseCode} ({selectedJustification.absenceDate})
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold text-right">
                  Review Status
                </span>
                <span
                  className={`font-black text-xs uppercase px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                    selectedJustification.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : selectedJustification.status === "PENDING"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                      : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                  }`}
                >
                  {selectedJustification.status}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Reason Provided
              </p>
              <p className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-700">
                {selectedJustification.reason}
              </p>
            </div>

            {selectedJustification.comment && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Additional Comments
                </p>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700">
                  {selectedJustification.comment}
                </p>
              </div>
            )}

            {/* Rejection Note if rejected */}
            {selectedJustification.status === "REJECTED" && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
                <p className="text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <XCircle size={14} /> Rejection Reason from Reviewer
                </p>
                <p className="text-xs text-red-700 dark:text-red-200">
                  {selectedJustification.rejectionReason || "Supporting document does not meet university requirements."}
                </p>
                {selectedJustification.reviewedByName && (
                  <p className="text-[11px] text-red-500 mt-1 italic">
                    Reviewed by {selectedJustification.reviewedByName} on {selectedJustification.reviewedAt}
                  </p>
                )}
              </div>
            )}

            {/* Attached Document Card */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Attached Document
              </p>
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {selectedJustification.documentName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {formatFileSize(selectedJustification.documentSize)} • {selectedJustification.documentType}
                    </p>
                  </div>
                </div>

                {selectedJustification.documentUrl && (
                  <a
                    href={selectedJustification.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={selectedJustification.documentName}
                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-1 text-xs font-bold shrink-0"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewDetailsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= SUBMITTED SUCCESS MODAL ================= */}
      <Modal
        isOpen={submittedSuccessModalOpen}
        onClose={() => setSubmittedSuccessModalOpen(false)}
        title="Justification Submitted"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
              Absence Justification Submitted!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
              Your explanation and supporting document have been transmitted to your course instructor and academic administration for verification.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-left text-xs space-y-1.5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Clock size={14} className="text-blue-500" />
              <span>Status: <strong>PENDING REVIEW</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Once approved, this absence will be marked as <strong>EXCUSED</strong>.</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSubmittedSuccessModalOpen(false);
                setActiveTab("justifications");
              }}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              View My Justifications
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

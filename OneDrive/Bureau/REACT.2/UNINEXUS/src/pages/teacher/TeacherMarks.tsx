import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { Badge } from "../../components/common/Badge";
import {
  Award,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import type { MarkRecord } from "../../types";

export const TeacherMarks: React.FC = () => {
  const { user } = useAuth();
  const { courses, users, marks, saveMarks } = useData();
  const { isDark } = useTheme();

  const teacherId = user?.id || "usr-teacher-1";
  const myClasses = courses.filter(
    (c) => c.lecturerId === teacherId || c.lecturerName.includes("Smith")
  );

  const [selectedCourseCode, setSelectedCourseCode] = useState("CS 201");
  const [saving, setSaving] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const studentUsers = users.filter((u) => u.role === "student");
  const currentCourse =
    courses.find((c) => c.code === selectedCourseCode) || myClasses[0];

  // Grade calculator helper
  const computeGrade = (total: number) => {
    if (total >= 90) return { grade: "A+", point: 4.0 };
    if (total >= 80) return { grade: "A", point: 4.0 };
    if (total >= 75) return { grade: "B+", point: 3.5 };
    if (total >= 70) return { grade: "B", point: 3.0 };
    if (total >= 65) return { grade: "C+", point: 2.5 };
    if (total >= 60) return { grade: "C", point: 2.0 };
    if (total >= 50) return { grade: "D", point: 1.0 };
    return { grade: "F", point: 0.0 };
  };

  // Local table state for marks
  const [localMarks, setLocalMarks] = useState<Record<string, { cw: number; ex: number }>>({
    "usr-student-1": { cw: 26, ex: 56 },
    "usr-student-2": { cw: 27, ex: 63 },
    "usr-student-3": { cw: 12, ex: 35 },
    "usr-student-4": { cw: 25, ex: 58 },
    "usr-student-5": { cw: 19, ex: 49 },
  });

  const handleScoreChange = (
    studentId: string,
    field: "cw" | "ex",
    val: number
  ) => {
    const clamped = Math.max(0, Math.min(field === "cw" ? 30 : 70, val));
    setLocalMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { cw: 0, ex: 0 }),
        [field]: clamped,
      },
    }));
  };

  const handleSaveDraft = async (submitForReview: boolean = false) => {
    setSaving(true);
    try {
      const records: MarkRecord[] = studentUsers.map((s) => {
        const scores = localMarks[s.id] || { cw: 0, ex: 0 };
        const total = scores.cw + scores.ex;
        const { grade, point } = computeGrade(total);

        return {
          id: `mrk-${s.id}-${currentCourse.code}`,
          studentId: s.id,
          studentName: s.name,
          matricNumber: s.identifier,
          courseId: currentCourse.id,
          courseCode: currentCourse.code,
          courseTitle: currentCourse.title,
          creditHours: currentCourse.creditHours,
          semester: "Semester 1 (2024/2025)",
          academicYear: "2024/2025",
          courseworkMark: scores.cw,
          examMark: scores.ex,
          totalMark: total,
          grade,
          gradePoint: point,
          status: submitForReview ? "submitted" : "draft",
        };
      });

      await saveMarks(records);
      setSubmittedNotice(true);
      setTimeout(() => setSubmittedNotice(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  // Performance analytics
  const totals = Object.values(localMarks).map((m) => m.cw + m.ex);
  const avgMark =
    totals.length > 0
      ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length)
      : 74;
  const passCount = totals.filter((t) => t >= 50).length;
  const passRate =
    totals.length > 0 ? Math.round((passCount / totals.length) * 100) : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Marks & Grade Entry
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Input continuous assessments, exam scores, and submit for Dean approval
          </p>
        </div>

        <select
          value={selectedCourseCode}
          onChange={(e) => setSelectedCourseCode(e.target.value)}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold outline-none focus:border-sky-500 shadow-2xs ${isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
        >
          {myClasses.map((c) => (
            <option key={c.id} value={c.code}>
              {c.code} — {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"} p-5 rounded-2xl border shadow-xs flex items-center justify-between`}>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Class Average
            </span>
            <h3 className={`text-2xl font-black mt-1 ${isDark ? "text-slate-100" : "text-slate-900"}`}>{avgMark}%</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <BarChart2 size={20} />
          </div>
        </div>

        <div className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"} p-5 rounded-2xl border shadow-xs flex items-center justify-between`}>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pass Rate
            </span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {passRate}%
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"} p-5 rounded-2xl border shadow-xs flex items-center justify-between`}>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Grading Status
            </span>
            <h3 className="text-sm font-bold text-amber-700 mt-1 flex items-center gap-1.5">
              Ready for Review
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* Main Grade Sheet Table */}
      <div className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"} rounded-3xl p-6 sm:p-8 border shadow-xs space-y-6`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-base font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
            Student Marks Sheet — {currentCourse.code} ({currentCourse.title})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Coursework: 30% Max • Final Exam: 70% Max
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className={`border-b text-xs font-bold text-slate-400 uppercase tracking-wider ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                <th className="pb-3">Student ID</th>
                <th className="pb-3">Student Name</th>
                <th className="pb-3 text-center w-32">Coursework (/30)</th>
                <th className="pb-3 text-center w-32">Exam (/70)</th>
                <th className="pb-3 text-center">Total (/100)</th>
                <th className="pb-3 text-center">Letter Grade</th>
                <th className="pb-3 text-right">Grade Point</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
              {studentUsers.map((stu) => {
                const cur = localMarks[stu.id] || { cw: 0, ex: 0 };
                const total = cur.cw + cur.ex;
                const { grade, point } = computeGrade(total);

                return (
                  <tr key={stu.id} className="hover:bg-slate-50">
                    <td className="py-3.5 font-mono font-bold text-sky-700 text-xs">
                      {stu.identifier}
                    </td>
                    <td className={`py-3.5 font-bold flex items-center gap-2.5 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                      <img
                        src={
                          stu.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        }
                        alt={stu.name}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      {stu.name}
                    </td>
                    <td className="py-3.5 text-center">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={cur.cw}
                        onChange={(e) =>
                          handleScoreChange(
                            stu.id,
                            "cw",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-sky-500"
                      />
                    </td>
                    <td className="py-3.5 text-center">
                      <input
                        type="number"
                        min={0}
                        max={70}
                        value={cur.ex}
                        onChange={(e) =>
                          handleScoreChange(
                            stu.id,
                            "ex",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20 px-2 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-sky-500"
                      />
                    </td>
                    <td className="py-3.5 text-center font-black text-slate-900 text-base">
                      {total}
                    </td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`font-black text-xs px-2.5 py-1 rounded-lg border ${
                          total >= 70
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : total >= 50
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {grade}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold text-slate-700">
                      {point.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {submittedNotice ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 size={16} />
              Marks Saved & Submitted for Verification!
            </div>
          ) : (
            <span className="text-xs text-slate-400">
              Marks will require Administrator approval before student release.
            </span>
          )}

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => handleSaveDraft(false)}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save size={15} />
              Save Draft
            </button>
            <button
              onClick={() => handleSaveDraft(true)}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-200 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Send size={15} />
              Submit to Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

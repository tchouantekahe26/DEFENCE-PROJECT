import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
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

  const teacherId = user?.id || "usr-teacher-1";
  const myClasses = courses.filter(
    (c) => c.lecturerId === teacherId || c.lecturerName.includes("Smith")
  );

  const [selectedCourseCode, setSelectedCourseCode] = useState("CS 201");
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [saving, setSaving] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const allStudentUsers = users.filter((u) => u.role === "student");
  const studentUsers = allStudentUsers.filter((u) => {
    if (selectedClass === "All") return true;
    const sClass = u.className || (u.identifier?.includes("BA2A") ? "BA2A" : u.identifier?.includes("BA2B") ? "BA2B" : "");
    return sClass === selectedClass;
  });
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
  const [localMarks, setLocalMarks] = useState<Record<string, { cw: number; ex: number }>>({});

  React.useEffect(() => {
    const courseMarks = marks.filter((m) => m.courseCode === selectedCourseCode);
    const map: Record<string, { cw: number; ex: number }> = {};
    courseMarks.forEach((m) => {
      map[m.studentId] = { cw: m.courseworkMark, ex: m.examMark };
    });
    setLocalMarks(map);
  }, [selectedCourseCode, marks]);

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

  const handleSaveMarks = async () => {
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
          status: "published", // Directly appears to student without waiting for admin validation
        };
      });

      await saveMarks(records);
      setSubmittedNotice(true);
      setTimeout(() => setSubmittedNotice(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Performance analytics
  const hasScores = Object.values(localMarks).some((m) => m.cw > 0 || m.ex > 0);
  const totals = Object.values(localMarks).map((m) => m.cw + m.ex);
  const avgMark =
    hasScores && totals.length > 0
      ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length)
      : null;
  const passCount = totals.filter((t) => t >= 50).length;
  const passRate =
    hasScores && totals.length > 0 ? Math.round((passCount / totals.length) * 100) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Marks & Grade Entry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Input continuous assessments and exam scores. Marks appear directly to students upon saving.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCourseCode}
            onChange={(e) => setSelectedCourseCode(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-sky-500 shadow-2xs"
          >
            {myClasses.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Class Selection Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Select Class Cohort:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["All", "BA2A", "BA2B"].map((cls) => {
            const count = cls === "All"
              ? allStudentUsers.length
              : allStudentUsers.filter((u) => (u.className || u.identifier).includes(cls)).length;
            const active = selectedClass === cls;
            return (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  active
                    ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{cls === "All" ? "All Cohorts" : `Class ${cls}`}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Class Average
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {avgMark !== null ? `${avgMark}%` : "N/A"}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <BarChart2 size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pass Rate
            </span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {passRate !== null ? `${passRate}%` : "N/A"}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Student Marks Sheet — {currentCourse.code} ({currentCourse.title})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Coursework: 30% Max • Final Exam: 70% Max
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Student ID</th>
                <th className="pb-3">Student Name</th>
                <th className="pb-3 text-center">Class</th>
                <th className="pb-3 text-center w-32">Coursework (/30)</th>
                <th className="pb-3 text-center w-32">Exam (/70)</th>
                <th className="pb-3 text-center">Total (/100)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    No registered students found in this cohort yet. Newly enrolled students will appear here automatically.
                  </td>
                </tr>
              ) : (
                studentUsers.map((stu) => {
                const cur = localMarks[stu.id] || { cw: 0, ex: 0 };
                const total = cur.cw + cur.ex;
                const stuClass = stu.className || (stu.identifier.includes("BA2A") ? "BA2A" : stu.identifier.includes("BA2B") ? "BA2B" : "BA2");

                return (
                  <tr key={stu.id} className="hover:bg-slate-50">
                    <td className="py-3.5 font-mono font-bold text-sky-700 text-xs">
                      {stu.identifier}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={
                          stu.avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        }
                        alt={stu.name}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                      <span>{stu.name}</span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider border ${
                        stuClass === "BA2B"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-sky-50 text-sky-700 border-sky-200"
                      }`}>
                        {stuClass}
                      </span>
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
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>

        {/* Action Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {submittedNotice ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 size={16} />
              Marks Saved & Directly Published to Students!
            </div>
          ) : (
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              Marks are published directly to students upon saving (no administrator approval needed).
            </span>
          )}

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={handleSaveMarks}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-200 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? "Publishing Marks..." : "Save & Publish Marks to Students"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

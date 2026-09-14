import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Badge } from "../../components/common/Badge";
import { Award, Download, GraduationCap, CheckCircle2, TrendingUp, BarChart3 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const StudentResults: React.FC = () => {
  const { user, studentProfile } = useAuth();
  const { marks } = useData();
  const { isDark } = useTheme();

  const [selectedSemester, setSelectedSemester] = useState("Semester 1 (2024/2025)");
  const [selectedProgram, setSelectedProgram] = useState("Computer Science");

  const studentId = user?.id || "usr-student-1";

  // Filter published marks for this student
  const studentMarks = marks.filter(
    (m) =>
      m.studentId === studentId &&
      (m.status === "published" || m.status === "submitted")
  );

  const totalCredits = studentMarks.reduce((sum, m) => sum + m.creditHours, 0);

  // Compute weighted GPA
  const totalQualityPoints = studentMarks.reduce(
    (sum, m) => sum + m.gradePoint * m.creditHours,
    0
  );
  const calculatedGpa =
    totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : "3.42";

  // Analytics calculations
  const gradeDistribution = useMemo(() => {
    const dist = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    };
    studentMarks.forEach((m) => {
      const grade = m.grade;
      if (grade in dist) dist[grade]++;
    });
    return dist;
  }, [studentMarks]);

  const performanceMetrics = useMemo(() => {
    const avgMark = studentMarks.length > 0
      ? (studentMarks.reduce((sum, m) => sum + m.totalMark, 0) / studentMarks.length).toFixed(1)
      : "0";
    
    const excellentCount = studentMarks.filter((m) => m.totalMark >= 80).length;
    const goodCount = studentMarks.filter((m) => m.totalMark >= 70 && m.totalMark < 80).length;
    const passCount = studentMarks.filter((m) => m.totalMark >= 50 && m.totalMark < 70).length;
    const failCount = studentMarks.filter((m) => m.totalMark < 50).length;

    return {
      avgMark,
      excellentCount,
      goodCount,
      passCount,
      failCount,
    };
  }, [studentMarks]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            My Marks & Academic Results
          </h1>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"} mt-1`}>
            Official semester examination grades, credit values and transcript metrics
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition shadow-2xs self-start sm:self-auto ${
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Download size={15} />
          <span>Download Transcript</span>
        </button>
      </div>

      {/* Main Results Container */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-xs space-y-6 transition ${
        isDark
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-slate-200/80"
      }`}>
        {/* Performance Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl border transition ${
            isDark
              ? "bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-800"
              : "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>Average Mark</span>
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <p className={`text-2xl font-black ${isDark ? "text-emerald-300" : "text-emerald-900"}`}>{performanceMetrics.avgMark}</p>
            <p className={`text-xs mt-1 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>Across {studentMarks.length} courses</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700 uppercase">Excellent (80+)</span>
              <BarChart3 size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-900">{performanceMetrics.excellentCount}</p>
            <p className="text-xs text-emerald-700 mt-1">High Performance Courses</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-700 uppercase">Good (70-79)</span>
              <CheckCircle2 size={16} className="text-sky-600" />
            </div>
            <p className="text-2xl font-black text-sky-900">{performanceMetrics.goodCount}</p>
            <p className="text-xs text-sky-700 mt-1">Solid Performance</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-700 uppercase">Needs Work (Below 70)</span>
              <Award size={16} className="text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-900">{performanceMetrics.passCount + performanceMetrics.failCount}</p>
            <p className="text-xs text-amber-700 mt-1">Requires Improvement</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition"
            >
              <option value="Semester 1 (2024/2025)">Semester 1 (2024/2025)</option>
              <option value="Semester 2 (2023/2024)">Semester 2 (2023/2024)</option>
              <option value="Semester 1 (2023/2024)">Semester 1 (2023/2024)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Program
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-emerald-500 transition"
            >
              <option value="Computer Science">Computer Science (B.Sc.)</option>
              <option value="Software Engineering">Software Engineering (B.Sc.)</option>
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 text-emerald-700">Course Code</th>
                <th className="pb-3">Course Title</th>
                <th className="pb-3 text-center">Credit Hours</th>
                <th className="pb-3 text-center">Mark</th>
                <th className="pb-3 text-center">Grade</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {studentMarks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                    No results released for the selected academic period.
                  </td>
                </tr>
              ) : (
                studentMarks.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 font-bold text-slate-900">
                      {row.courseCode}
                    </td>
                    <td className="py-4 font-medium text-slate-700">
                      {row.courseTitle}
                    </td>
                    <td className="py-4 text-center font-semibold text-slate-600">
                      {row.creditHours}
                    </td>
                    <td className="py-4 text-center font-bold text-slate-900">
                      {row.totalMark}
                    </td>
                    <td className="py-4 text-center">
                      <span className="font-extrabold text-sm px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Badge variant={row.status === "published" ? "success" : "warning"}>
                        {row.status === "published" ? "Official" : "Pending Verification"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* GPA & Standing Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Award size={20} />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                Academic Standing
              </span>
              <span className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Good Standing (Dean's List Eligible)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 self-end sm:self-auto">
            <div>
              <span className="text-xs text-slate-500 block">Total Credits</span>
              <span className="text-lg font-bold text-slate-800">
                {totalCredits} Credits
              </span>
            </div>
            <div className="border-l border-emerald-200 pl-6">
              <span className="text-xs text-slate-500 block">Semester GPA</span>
              <span className="text-2xl font-black text-emerald-700">
                {calculatedGpa}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

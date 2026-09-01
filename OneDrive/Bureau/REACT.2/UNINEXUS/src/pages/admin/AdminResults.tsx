import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import {
  FileCheck,
  CheckCircle2,
  Award,
  Search,
  Check,
  Eye,
  Send,
} from "lucide-react";
import type { MarkRecord } from "../../types";

export const AdminResults: React.FC = () => {
  const { marks, publishCourseMarks } = useData();

  const [search, setSearch] = useState("");
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("All");
  const [selectedMark, setSelectedMark] = useState<MarkRecord | null>(null);
  const [publishedSuccess, setPublishedSuccess] = useState<string | null>(null);

  // Group marks by course code
  const coursesWithMarks = Array.from(new Set(marks.map((m) => m.courseCode)));

  const pendingMarks = marks.filter((m) => m.status === "submitted");
  const publishedMarks = marks.filter((m) => m.status === "published");

  const filteredMarks = marks.filter((m) => {
    const matchesCourse =
      selectedCourseCode === "All" || m.courseCode === selectedCourseCode;
    const matchesSearch =
      m.studentName.toLowerCase().includes(search.toLowerCase()) ||
      m.matricNumber.toLowerCase().includes(search.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const handlePublishCourse = async (code: string) => {
    await publishCourseMarks(code);
    setPublishedSuccess(`All submitted grades for ${code} have been verified & published!`);
    setTimeout(() => setPublishedSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Results & Examination Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review faculty mark submissions, verify grade distributions and publish official transcripts
          </p>
        </div>
      </div>

      {publishedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{publishedSuccess}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Pending Verification
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {pendingMarks.length}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Submitted by teachers</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Published Records
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {publishedMarks.length}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Active in student portals</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Academic Session
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              2024/2025
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Semester 1 Exam Window</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FileCheck size={24} />
          </div>
        </div>
      </div>

      {/* Course-level Batch Publish Action Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Faculty Grade Submissions by Course
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {coursesWithMarks.map((code) => {
            const courseMarks = marks.filter((m) => m.courseCode === code);
            const hasPending = courseMarks.some((m) => m.status === "submitted");

            return (
              <div
                key={code}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {code}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">
                    {courseMarks[0]?.courseTitle || code}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {courseMarks.length} Students Graded
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  {hasPending ? (
                    <button
                      onClick={() => handlePublishCourse(code)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} />
                      Approve & Publish
                    </button>
                  ) : (
                    <span className="inline-block w-full py-1.5 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                      ✓ Published
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", ...coursesWithMarks].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCourseCode(c)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCourseCode === c
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or matric..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Matric ID</th>
                <th className="pb-3">Course</th>
                <th className="pb-3 text-center">Coursework</th>
                <th className="pb-3 text-center">Exam</th>
                <th className="pb-3 text-center">Total</th>
                <th className="pb-3 text-center">Grade</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMarks.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 font-bold text-slate-900">
                    {row.studentName}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-indigo-700 text-xs">
                    {row.matricNumber}
                  </td>
                  <td className="py-3.5 text-xs font-bold text-slate-800">
                    {row.courseCode}
                  </td>
                  <td className="py-3.5 text-center text-slate-600 font-medium">
                    {row.courseworkMark}/30
                  </td>
                  <td className="py-3.5 text-center text-slate-600 font-medium">
                    {row.examMark}/70
                  </td>
                  <td className="py-3.5 text-center font-black text-slate-900">
                    {row.totalMark}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="font-extrabold text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {row.grade}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Badge
                      variant={row.status === "published" ? "success" : "warning"}
                    >
                      {row.status === "published" ? "Published" : "Pending Review"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import {
  Users,
  Search,
  GraduationCap,
  Award,
  CalendarCheck,
  Filter,
} from "lucide-react";
import type { User } from "../../types";
import { DEFAULT_AVATARS } from "../../utils/avatar";

export const AdminStudents: React.FC = () => {
  const { users, marks, enrollments } = useData();

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const students = users.filter((u) => u.role === "student");

  const getStudentCgpa = (studentId: string) => {
    const stuMarks = marks.filter(
      (m) => m.studentId === studentId && (m.status === "published" || m.status === "submitted")
    );
    const stuCredits = stuMarks.reduce((sum, m) => sum + m.creditHours, 0);
    const stuQualityPoints = stuMarks.reduce((sum, m) => sum + m.gradePoint * m.creditHours, 0);
    return stuCredits > 0 ? (stuQualityPoints / stuCredits).toFixed(2) : "N/A";
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.identifier.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "all" || s.level === levelFilter;
    const studentClass = s.className || (s.identifier.includes("BA2A") ? "BA2A" : s.identifier.includes("BA2B") ? "BA2B" : "");
    const matchesClass = classFilter === "all" || studentClass === classFilter;
    return matchesSearch && matchesLevel && matchesClass;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Student Academic Records & Enrollment
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track student academic standing, matriculation, department allocations and GPAs
          </p>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: `All Students (${students.length})` },
              { id: "BA2A", label: `Class BA2A (${students.filter(s => (s.className || s.identifier).includes("BA2A")).length})` },
              { id: "BA2B", label: `Class BA2B (${students.filter(s => (s.className || s.identifier).includes("BA2B")).length})` },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setClassFilter(btn.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  classFilter === btn.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {btn.label}
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
              placeholder="Search by student or matric..."
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
                <th className="pb-3">Class</th>
                <th className="pb-3">Program</th>
                <th className="pb-3">Level</th>
                <th className="pb-3 text-center">CGPA</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu) => {
                const stuClass = stu.className || (stu.identifier.includes("BA2A") ? "BA2A" : stu.identifier.includes("BA2B") ? "BA2B" : "BA2A");
                return (
                <tr key={stu.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 font-bold text-slate-900 flex items-center gap-3">
                    <img
                      src={
                        stu.avatar || DEFAULT_AVATARS.student
                      }
                      alt={stu.name}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p>{stu.name}</p>
                        {stu.hideInfo && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 font-semibold" title="Student set profile information to private">
                            🔒 Private
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-normal">
                        {stu.hideInfo ? "•••••••••••• (Private)" : stu.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 font-mono font-bold text-indigo-700 text-xs">
                    {stu.identifier}
                  </td>
                  <td className="py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider border ${
                      stuClass === "BA2B"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-sky-50 text-sky-700 border-sky-200"
                    }`}>
                      {stuClass}
                    </span>
                  </td>
                  <td className="py-4 text-xs text-slate-600">
                    {stu.program || "Computer Science"}
                  </td>
                  <td className="py-4 text-xs font-semibold text-slate-700">
                    {stu.level || "Level 2"}
                  </td>
                  <td className="py-4 text-center font-black text-indigo-900">
                    {getStudentCgpa(stu.id)}
                  </td>
                  <td className="py-4 text-center">
                    <Badge variant={stu.status === "active" ? "success" : "neutral"}>
                      {stu.status === "active" ? "Enrolled" : "Suspended"}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(stu)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200 transition"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Dossier Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Academic Dossier: ${selectedStudent.name}`}
          subtitle={`Matric: ${selectedStudent.identifier} • Department: ${selectedStudent.department}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="text-center pb-4 border-b border-slate-100">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto mb-2 ring-2 ring-indigo-200 shadow-sm"
              />
              <h3 className="text-base font-bold text-slate-900">
                {selectedStudent.name}
              </h3>
              <p className="text-slate-500">
                {selectedStudent.hideInfo ? "•••••••••••• (Hidden by student)" : selectedStudent.email}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Program</span>
                <span className="font-bold text-slate-800">{selectedStudent.program}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Faculty</span>
                <span className="font-bold text-slate-800">{selectedStudent.faculty || "School of Computing"}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Level</span>
                <span className="font-bold text-slate-800">{selectedStudent.level}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Phone</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.hideInfo ? "•••••••••••• (Private)" : (selectedStudent.phone || "Not provided")}
                </span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

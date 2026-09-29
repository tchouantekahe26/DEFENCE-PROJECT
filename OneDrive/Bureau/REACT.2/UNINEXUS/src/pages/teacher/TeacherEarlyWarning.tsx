import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import {
  AlertTriangle,
  ShieldCheck,
  User,
  Search,
  CheckCircle2,
  FileText,
  Mail,
  Send,
  Plus,
} from "lucide-react";
import type { EarlyWarningStudent } from "../../types";

export const TeacherEarlyWarning: React.FC = () => {
  const { earlyWarningStudents, addEarlyWarningIntervention, users } = useData();

  const [selectedStudent, setSelectedStudent] = useState<EarlyWarningStudent | null>(null);
  const [interventionNote, setInterventionNote] = useState("");
  const [search, setSearch] = useState("");

  const atRiskCount = earlyWarningStudents.filter(
    (s) => s.riskType.toLowerCase().includes("risk") || s.riskType.toLowerCase().includes("critical")
  ).length;
  const warningsCount = earlyWarningStudents.filter(
    (s) => s.riskType.toLowerCase().includes("warning")
  ).length;
  const studentUsers = users.filter((u) => u.role === "student");
  const flaggedIds = new Set(earlyWarningStudents.map((s) => s.matricNumber));
  const goodStandingCount = studentUsers.filter((u) => !flaggedIds.has(u.identifier)).length;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !interventionNote.trim()) return;

    addEarlyWarningIntervention(selectedStudent.id, interventionNote);
    setInterventionNote("");
    setSelectedStudent((prev) =>
      prev
        ? {
            ...prev,
            interventionNotes: [...(prev.interventionNotes || []), interventionNote],
          }
        : null
    );
  };

  const filteredStudents = earlyWarningStudents.filter(
    (s) =>
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.riskType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          AI Early Warning & Retention System
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Predictive machine learning analytics identifying students at academic or attendance risk
        </p>
      </div>

      {/* 3 Metric Cards matching reference mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              At Risk
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {atRiskCount}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Critical intervention</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Warnings
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {warningsCount}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Attendance/Grade flags</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Good Standing
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {goodStandingCount}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Healthy progression</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* Main Student Intervention Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Students Needing Attention
            </h2>
            <p className="text-xs text-slate-500">
              Automated algorithmic flags generated from continuous marks & attendance sheets
            </p>
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
              placeholder="Search at-risk students..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-sky-500 transition"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="font-bold text-slate-700">All Students in Good Standing</p>
              <p className="text-xs mt-1">No students have been flagged for attendance or grade risks.</p>
            </div>
          ) : (
            filteredStudents.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition px-2 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.avatar ||
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
                    }
                    alt={item.studentName}
                    className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {item.studentName}
                      </h4>
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        {item.matricNumber}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                        {item.riskType}
                      </span>
                      <span className="text-xs text-slate-500">
                        Attendance: <strong>{item.attendanceRate}%</strong> • Avg Mark:{" "}
                        <strong>{item.averageMark}%</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => setSelectedStudent(item)}
                    className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200 transition"
                  >
                    View Details & Intervene
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Intervention Detail Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Academic Intervention Profile: ${selectedStudent.studentName}`}
          subtitle={`${selectedStudent.matricNumber} • ${selectedStudent.program}`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-sm">
            {/* Risk Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-3.5 rounded-2xl border border-red-100">
                <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">
                  Identified Risk Factor
                </span>
                <span className="text-sm font-black text-red-900 mt-1 block">
                  {selectedStudent.riskType}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Attendance & Grades
                </span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">
                  {selectedStudent.attendanceRate}% Attendance • {selectedStudent.averageMark}% Avg
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Courses Flagged At Risk
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.coursesAtRisk.map((c, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Intervention Notes Log */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Intervention History & Counseling Log
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedStudent.interventionNotes?.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed"
                  >
                    • {note}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Intervention Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Log New Intervention Action
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={interventionNote}
                  onChange={(e) => setInterventionNote(e.target.value)}
                  placeholder="e.g. Scheduled remedial tutoring session / Contacted student"
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
                >
                  Save Note
                </button>
              </div>
            </form>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

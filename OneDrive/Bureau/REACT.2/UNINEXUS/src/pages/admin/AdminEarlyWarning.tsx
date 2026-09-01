import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import {
  AlertTriangle,
  ShieldCheck,
  Search,
  User,
  CheckCircle2,
  TrendingDown,
  Mail,
  Send,
} from "lucide-react";
import type { EarlyWarningStudent } from "../../types";

export const AdminEarlyWarning: React.FC = () => {
  const { earlyWarningStudents, addEarlyWarningIntervention } = useData();

  const [selectedStudent, setSelectedStudent] = useState<EarlyWarningStudent | null>(null);
  const [search, setSearch] = useState("");
  const [note, setNote] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !note.trim()) return;

    addEarlyWarningIntervention(selectedStudent.id, note);
    setNote("");
    setSelectedStudent((prev) =>
      prev ? { ...prev, interventionNotes: [...(prev.interventionNotes || []), note] } : null
    );
  };

  const filtered = earlyWarningStudents.filter(
    (s) =>
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Institutional AI Early Warning & Retention Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          University-wide student retention risk modeling and intervention management
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Critical Risk Students
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">8</h3>
            <p className="text-xs text-slate-400 mt-0.5">Below 50% avg / &lt;70% attendance</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Probation Warnings
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">15</h3>
            <p className="text-xs text-slate-400 mt-0.5">Attendance or coursework notices</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Good Standing Rate
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">94.2%</h3>
            <p className="text-xs text-slate-400 mt-0.5">1,176 active students</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* Main Student Directory */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900">
            At-Risk Student Registry
          </h2>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student or department..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.map((item) => (
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
                      {item.department} • Attendance: <strong>{item.attendanceRate}%</strong> • Avg:{" "}
                      <strong>{item.averageMark}%</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={() => setSelectedStudent(item)}
                  className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200 transition"
                >
                  Admin Case File
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case File Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Intervention Case File: ${selectedStudent.studentName}`}
          subtitle={`${selectedStudent.matricNumber} • ${selectedStudent.program}`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-3.5 rounded-2xl border border-red-100">
                <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">
                  Identified Risk
                </span>
                <span className="text-sm font-black text-red-900 mt-1 block">
                  {selectedStudent.riskType}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Performance Metrics
                </span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">
                  {selectedStudent.attendanceRate}% Attendance • {selectedStudent.averageMark}% Avg Mark
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Counseling & Action Log
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedStudent.interventionNotes?.map((n, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed"
                  >
                    • {n}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Record Registry Action / Academic Advisory Note
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Dean warning issued / Parent notified"
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
                >
                  Record Action
                </button>
              </div>
            </form>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close Case
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

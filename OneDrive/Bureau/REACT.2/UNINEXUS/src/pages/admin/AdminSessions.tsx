import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Badge } from "../../components/common/Badge";
import { Clock, Calendar, CheckCircle2, Save, ToggleLeft, ToggleRight } from "lucide-react";
import type { AcademicSession } from "../../types";

export const AdminSessions: React.FC = () => {
  const { academicSessions, updateAcademicSession } = useData();

  const [activeSession, setActiveSession] = useState<AcademicSession>(
    academicSessions[0] || {
      id: "sess-1",
      name: "2024/2025",
      currentSemester: "Semester 1",
      startDate: "2024-09-01",
      endDate: "2025-06-30",
      registrationOpen: true,
      resultsPublished: true,
      isActive: true,
    }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleRegistration = () => {
    const updated = {
      ...activeSession,
      registrationOpen: !activeSession.registrationOpen,
    };
    setActiveSession(updated);
    updateAcademicSession(activeSession.id, updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAcademicSession(activeSession.id, activeSession);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Academic Sessions & Semester Periods
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Control active academic calendars, open/close course add/drop windows and term dates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Session Configuration */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Current Session Settings
                </h3>
                <p className="text-xs text-slate-500">
                  Active academic session driving registrations and timetables
                </p>
              </div>
            </div>

            <Badge variant="success">Active Session</Badge>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Session Name
                </label>
                <input
                  type="text"
                  value={activeSession.name}
                  onChange={(e) =>
                    setActiveSession({ ...activeSession, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Semester
                </label>
                <select
                  value={activeSession.currentSemester}
                  onChange={(e) =>
                    setActiveSession({
                      ...activeSession,
                      currentSemester: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Summer">Summer Term</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={activeSession.startDate}
                  onChange={(e) =>
                    setActiveSession({
                      ...activeSession,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={activeSession.endDate}
                  onChange={(e) =>
                    setActiveSession({ ...activeSession, endDate: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Course Registration Toggle Switch */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Student Course Registration Window
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Allow students to add or drop semester course modules
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleRegistration}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeSession.registrationOpen
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {activeSession.registrationOpen ? "Open (Active)" : "Closed"}
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 size={16} />
                  Session Parameters Updated!
                </div>
              ) : (
                <span />
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
              >
                <Save size={15} />
                Save Session Changes
              </button>
            </div>
          </form>
        </div>

        {/* Sessions History List */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Academic Session Archives
            </h3>

            {academicSessions.map((s) => (
              <div
                key={s.id}
                className={`p-4 rounded-2xl border transition ${
                  s.isActive
                    ? "bg-indigo-50/50 border-indigo-200"
                    : "bg-slate-50 border-slate-200/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">
                    {s.name}
                  </span>
                  <Badge variant={s.isActive ? "primary" : "neutral"}>
                    {s.isActive ? "Active" : "Archived"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {s.currentSemester} • {s.startDate} to {s.endDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

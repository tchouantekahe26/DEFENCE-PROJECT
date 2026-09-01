import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Filter,
  Download,
} from "lucide-react";

export const StudentTimetable: React.FC = () => {
  const { timetableSlots } = useData();
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
  const timeSlots = [
    { start: "08:00", end: "10:00", label: "08:00 - 10:00" },
    { start: "10:00", end: "12:00", label: "10:00 - 12:00" },
    { start: "12:00", end: "13:00", label: "12:00 - 13:00 (Lunch Break)" },
    { start: "13:00", end: "14:00", label: "13:00 - 14:00" },
    { start: "14:00", end: "16:00", label: "14:00 - 16:00" },
    { start: "16:00", end: "18:00", label: "16:00 - 18:00" },
  ];

  const getSlot = (day: string, startTime: string) => {
    return timetableSlots.find(
      (s) => s.day === day && s.startTime === startTime
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Academic Timetable
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Program: Computer Science • Semester 1 (2024/2025)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "weekly"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode("daily")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "daily"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Daily View
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Download size={14} />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* ================= WEEKLY GRID VIEW ================= */}
      {viewMode === "weekly" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr>
                  <th className="p-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-36 border-b border-slate-100 bg-slate-50/50 rounded-tl-2xl">
                    Time
                  </th>
                  {days.map((day, idx) => (
                    <th
                      key={day}
                      className={`p-3.5 text-center text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50 ${
                        idx === days.length - 1 ? "rounded-tr-2xl" : ""
                      }`}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeSlots.map((time) => {
                  const isBreak = time.label.includes("Break");

                  if (isBreak) {
                    return (
                      <tr key={time.start} className="bg-slate-50/60">
                        <td className="p-3 text-xs font-bold text-slate-400">
                          {time.start} - {time.end}
                        </td>
                        <td
                          colSpan={5}
                          className="p-3 text-center text-xs font-semibold text-slate-400 italic tracking-wider"
                        >
                          ☕ Lunch & Activity Break
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={time.start} className="h-28">
                      <td className="p-3.5 text-xs font-bold text-slate-500 align-top">
                        {time.label}
                      </td>

                      {days.map((day) => {
                        const slot = getSlot(day, time.start);

                        return (
                          <td
                            key={day}
                            className="p-2 border-l border-slate-100 align-top w-1/5"
                          >
                            {slot ? (
                              <div
                                className={`p-3 rounded-2xl border text-left transition hover:shadow-sm ${
                                  slot.color ||
                                  "bg-emerald-50 border-emerald-200 text-emerald-900"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="text-[11px] font-black tracking-tight">
                                    {slot.courseCode}
                                  </span>
                                  <span className="text-[10px] font-semibold opacity-75">
                                    {slot.classroom}
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold leading-tight line-clamp-2">
                                  {slot.courseTitle}
                                </h4>
                                <p className="text-[10px] mt-1 opacity-80 truncate">
                                  {slot.lecturerName}
                                </p>
                              </div>
                            ) : (
                              <div className="h-full rounded-2xl flex items-center justify-center text-slate-200 text-xs font-medium border border-dashed border-slate-100">
                                —
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= DAILY LIST VIEW ================= */}
      {viewMode === "daily" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Day selection tabs */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedDay === day
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {timetableSlots.filter((s) => s.day === selectedDay).length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CalendarIcon size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">
                  No classes scheduled on {selectedDay}
                </p>
              </div>
            ) : (
              timetableSlots
                .filter((s) => s.day === selectedDay)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/30 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                        {slot.courseCode}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {slot.courseTitle}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <User size={13} className="text-slate-400" />
                            {slot.lecturerName}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-slate-400" />
                            {slot.classroom}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs self-start sm:self-auto">
                      <Clock size={14} className="text-emerald-600" />
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Filter,
  Download,
  FileText,
  Printer,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { downloadTimetablePDF } from "../../services/timetablePdf";

export const StudentTimetable: React.FC = () => {
  const { timetableSlots } = useData();
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [viewMode, setViewMode] = useState<"weekly" | "daily">("weekly");
  const [isDownloading, setIsDownloading] = useState(false);

  const studentClass = user?.className || "BA1A";
  const studentLevel = user?.level || "Level 1";
  const studentDept = user?.department || "Computer Science";

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;

  const timeSlots = [
    { start: "07:30", end: "09:30", label: "07:30-09:30", isBreak: false },
    { start: "09:30", end: "11:30", label: "09:30-11:30", isBreak: false },
    { start: "11:30", end: "12:45", label: "BREAK: 11:30-12:45", isBreak: true },
    { start: "12:45", end: "14:45", label: "12:45-14:45", isBreak: false },
    { start: "14:45", end: "16:45", label: "14:45-16:45", isBreak: false },
  ];

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      downloadTimetablePDF({
        program: `${studentDept} • ${studentLevel} - ${studentClass}`,
        semester: "Semester 2",
        academicYear: "2025/2026",
        slots: timetableSlots.filter((s) => s.className === studentClass || !s.className),
      });
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const getSlot = (day: string, startTime: string) => {
    return timetableSlots.find(
      (s) => s.day === day && s.startTime === startTime && (s.className === studentClass || !s.className)
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Official Publication Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-900/40 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start sm:items-center gap-3.5 relative z-10">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl shrink-0">
            <FileText size={22} className="text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-white/20 text-white tracking-wider">
                Official Administration Document
              </span>
              <span className="text-xs text-indigo-200 font-semibold">• Week: 30th Mar – 4th Apr 2026</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Official Academic Timetable (PDF)
            </h3>
            <p className="text-xs text-indigo-100 mt-0.5">
              Verified & approved by the Directorate of Academic Affairs. Download and save to your phone or laptop.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-xs shadow-md transition shrink-0 active:scale-95 relative z-10"
        >
          <Download size={15} className="text-indigo-600" />
          <span>{isDownloading ? "Generating PDF..." : "Download Official PDF"}</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Academic Timetable
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Program: {studentDept} • {studentLevel} - {studentClass}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
            title="Download PDF"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Save PDF</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="Print"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* ================= WEEKLY GRID VIEW ================= */}
      {viewMode === "weekly" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Official Institution Header */}
          <div className="text-center py-5 px-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 font-black text-xs tracking-wider mb-2 shadow-xs">
              IAI
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
              Inter-States Institute of Higher Education
            </h2>
            <p className="text-xs font-semibold text-slate-600">
              Cameroon Representation
            </p>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase mt-0.5">
              PAUL BIYA TECHNOLOGICAL CENTRE OF EXCELLENCE
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              P.O. Box 13 719 Yaounde (Cameroon) Tel. (237) 242 72 99 57 - 242 72 99 58
            </p>
            <p className="text-[11px] text-slate-500">
              Website: www.iaicameroun.com • E-mail: contact@iaicameroun.com
            </p>
            <div className="mt-2.5 inline-block px-4 py-1 rounded-full bg-sky-100 text-sky-900 font-extrabold text-xs uppercase tracking-wider border border-sky-200">
              WEEK: 30TH MAR – 4TH APR 2026 • {studentLevel} - {studentClass}
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[900px] border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="p-3 text-center text-xs font-black uppercase tracking-wider w-36 border border-slate-700">
                    Time/Days
                  </th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="p-3 text-center text-xs font-black uppercase tracking-wider border border-slate-700"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {timeSlots.map((time) => {
                  if (time.isBreak) {
                    return (
                      <tr key={time.start} className="h-12 bg-amber-100/70 border-y-2 border-amber-300/70">
                        <td className="p-2 text-center text-xs font-black text-amber-900 border border-amber-200 whitespace-nowrap">
                          {time.label}
                        </td>
                        {days.map((dayName) => (
                          <td
                            key={dayName}
                            className="p-2 text-center text-xs font-black tracking-widest text-amber-800 border border-amber-200 uppercase"
                          >
                            BREAK
                          </td>
                        ))}
                      </tr>
                    );
                  }

                  return (
                    <tr key={time.start} className="h-28">
                      <td className="p-3 text-xs font-bold text-slate-700 text-center align-middle border border-slate-200 bg-slate-50/70">
                        {time.label}
                      </td>

                      {days.map((day) => {
                        const slot = getSlot(day, time.start);

                        return (
                          <td
                            key={day}
                            className="p-2 border border-slate-200 align-top w-[14.2%] min-w-[140px] bg-slate-50/30"
                          >
                            {slot ? (
                              <div
                                className="p-3 rounded-xl border bg-white border-l-4 border-l-sky-500 border-slate-200 text-slate-900 transition hover:shadow-md flex flex-col justify-between min-h-[105px]"
                              >
                                <div className="w-full text-center">
                                  <h4 className="text-xs font-black text-slate-900 tracking-wide uppercase leading-tight line-clamp-2">
                                    {slot.courseTitle}
                                  </h4>
                                  <p className="text-[11px] font-semibold text-sky-600 mt-1 truncate">
                                    {slot.lecturerName}
                                  </p>
                                  <p className="text-[10px] font-medium text-slate-700 mt-0.5">
                                    Location : <span className="font-bold text-sky-700">{slot.classroom}</span>
                                  </p>
                                  {slot.hoursProgress && (
                                    <p className="text-[10px] font-bold text-amber-600 mt-0.5 tracking-tight">
                                      {slot.hoursProgress}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="h-full min-h-[6.5rem] rounded-xl flex items-center justify-center text-slate-300 text-xs font-medium border border-dashed border-slate-200">
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

          {/* Institutional Signatures */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-slate-200 text-center text-xs text-slate-600 font-bold">
            <div className="pt-4">
              <p>Deputy Director, Head of SE</p>
            </div>
            <div className="pt-4">
              <p>Deputy Director, Head of SN</p>
            </div>
            <div className="pt-4">
              <p>Director of Academic Affaires</p>
            </div>
            <div className="pt-4">
              <p>Resident Representative</p>
            </div>
          </div>
          <div className="text-center pb-4 text-[10px] text-slate-400">
            Generated on 3/27/2026 • Official Institutional Timetable
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
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
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
                    className="p-5 rounded-2xl bg-slate-50 hover:bg-indigo-50/30 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center shrink-0">
                        <FileText size={18} />
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
                      <Clock size={14} className="text-indigo-600" />
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

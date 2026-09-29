import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";

export const TeacherTimetable: React.FC = () => {
  const { timetableSlots } = useData();
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("BA2A");

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

  const getSlot = (dayName: string, start: string) => {
    return timetableSlots.find(
      (s) =>
        s.day === dayName &&
        s.startTime === start &&
        (s.className === selectedClass || s.classroom === selectedClass)
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Faculty Class Schedule
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Weekly course timetable, room locations and assigned lecture hours
          </p>
        </div>

        {/* Class Selection Buttons */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Class:
          </span>
          {[
            { id: "BA2A", label: "BA2A", level: "L2" },
            { id: "BA2B", label: "BA2B", level: "L2" },
            { id: "BA1A", label: "BA1A", level: "L1" },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedClass(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                selectedClass === c.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-normal ${
                selectedClass === c.id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-600 text-slate-500"
              }`}>
                {c.level}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Timetable Grid */}
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
            WEEK: 30TH MAR – 4TH APR 2026 {selectedClass.startsWith("BA2") ? "LEVEL 2" : "LEVEL 1"} - {selectedClass}
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full min-w-[900px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-3 text-center text-xs font-black uppercase tracking-wider w-36 border border-slate-700">
                  Time/Days
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    className="p-3 text-center text-xs font-black uppercase tracking-wider border border-slate-700"
                  >
                    {d}
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

                    {days.map((dayName) => {
                      const slot = getSlot(dayName, time.start);
                      const isMyCourse =
                        user?.name && slot?.lecturerName?.toLowerCase().includes(user.name.toLowerCase().split(" ")[0]);

                      return (
                        <td
                          key={dayName}
                          className="p-2 border border-slate-200 align-top w-[14.2%] min-w-[140px] bg-slate-50/30"
                        >
                          {slot ? (
                            <div
                              className={`p-3 rounded-xl border bg-white border-l-4 border-l-sky-500 border-slate-200 text-slate-900 transition hover:shadow-md flex flex-col justify-between min-h-[105px] ${
                                isMyCourse ? "ring-2 ring-sky-400 bg-sky-50/30" : ""
                              }`}
                            >
                              <div className="w-full text-center">
                                {isMyCourse && (
                                  <div className="mb-1">
                                    <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                                      My Lecture
                                    </span>
                                  </div>
                                )}
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
    </div>
  );
};

export default TeacherTimetable;

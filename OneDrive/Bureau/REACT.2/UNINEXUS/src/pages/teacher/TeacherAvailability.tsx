import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Calendar,
  Send,
  Sparkles,
  Info,
  CheckSquare,
  Square,
  AlertCircle,
  FileCheck2,
  Building2,
  UserCheck,
} from "lucide-react";
import type { TeacherAvailabilitySlot } from "../../types";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const PERIODS = [
  { startTime: "07:30", endTime: "09:30", label: "07:30 - 09:30", period: "Period 1" },
  { startTime: "09:30", endTime: "11:30", label: "09:30 - 11:30", period: "Period 2" },
  { startTime: "12:45", endTime: "14:45", label: "12:45 - 14:45", period: "Period 3" },
  { startTime: "14:45", endTime: "16:45", label: "14:45 - 16:45", period: "Period 4" },
] as const;

export const TeacherAvailability: React.FC = () => {
  const { user } = useAuth();
  const { teacherAvailabilities, submitTeacherAvailability } = useData();

  const teacherId = user?.id || "usr-teacher-1";
  const teacherName = user?.name || "Teacher";
  const teacherEmail = user?.email || "teacher@uninexus.edu";
  const department = user?.department || "Computer Science";

  const [selectedSemester, setSelectedSemester] = useState("Semester 2");
  const [academicYear, setAcademicYear] = useState("2025/2026");
  const [maxHours, setMaxHours] = useState<number>(16);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Key format: `${day}_${startTime}_${endTime}`
  const [selectedSlots, setSelectedSlots] = useState<Record<string, boolean>>({});

  // Check if teacher has existing submission for this semester
  const existingSubmission = useMemo(() => {
    return teacherAvailabilities.find(
      (a) => a.teacherId === teacherId && a.semester === selectedSemester
    );
  }, [teacherAvailabilities, teacherId, selectedSemester]);

  // Load existing submission if available
  useEffect(() => {
    if (existingSubmission) {
      const map: Record<string, boolean> = {};
      existingSubmission.slots.forEach((s) => {
        const key = `${s.day}_${s.startTime}_${s.endTime}`;
        map[key] = s.isAvailable;
      });
      setSelectedSlots(map);
      if (existingSubmission.maxHoursPerWeek) setMaxHours(existingSubmission.maxHoursPerWeek);
      if (existingSubmission.notes) setNotes(existingSubmission.notes);
    } else {
      // Default: morning slots on weekdays selected
      const map: Record<string, boolean> = {};
      DAYS.forEach((day) => {
        PERIODS.forEach((period) => {
          const key = `${day}_${period.startTime}_${period.endTime}`;
          if (day !== "Saturday" && (period.startTime === "07:30" || period.startTime === "09:30")) {
            map[key] = true;
          } else {
            map[key] = false;
          }
        });
      });
      setSelectedSlots(map);
    }
  }, [existingSubmission, selectedSemester]);

  // Toggle individual slot
  const handleToggleSlot = (day: string, startTime: string, endTime: string) => {
    const key = `${day}_${startTime}_${endTime}`;
    setSelectedSlots((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Quick Action presets
  const handleSelectAll = () => {
    const map: Record<string, boolean> = {};
    DAYS.forEach((day) => {
      PERIODS.forEach((p) => {
        map[`${day}_${p.startTime}_${p.endTime}`] = true;
      });
    });
    setSelectedSlots(map);
  };

  const handleClearAll = () => {
    const map: Record<string, boolean> = {};
    DAYS.forEach((day) => {
      PERIODS.forEach((p) => {
        map[`${day}_${p.startTime}_${p.endTime}`] = false;
      });
    });
    setSelectedSlots(map);
  };

  const handleSelectMornings = () => {
    setSelectedSlots((prev) => {
      const next = { ...prev };
      DAYS.forEach((day) => {
        next[`${day}_07:30_09:30`] = true;
        next[`${day}_09:30_11:30`] = true;
      });
      return next;
    });
  };

  const handleSelectAfternoons = () => {
    setSelectedSlots((prev) => {
      const next = { ...prev };
      DAYS.forEach((day) => {
        next[`${day}_12:45_14:45`] = true;
        next[`${day}_14:45_16:45`] = true;
      });
      return next;
    });
  };

  const handleSelectWeekdaysOnly = () => {
    setSelectedSlots((prev) => {
      const next = { ...prev };
      PERIODS.forEach((p) => {
        next[`Saturday_${p.startTime}_${p.endTime}`] = false;
      });
      return next;
    });
  };

  // Compute live availability stats
  const totalSlotsCount = DAYS.length * PERIODS.length; // 24
  const availableSlotsCount = useMemo(() => {
    return Object.values(selectedSlots).filter(Boolean).length;
  }, [selectedSlots]);
  const availableHours = availableSlotsCount * 2; // each slot is 2 hours

  // Submit to admin
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (availableSlotsCount === 0) {
      alert("Please select at least one available timetable slot before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const slots: TeacherAvailabilitySlot[] = [];
      DAYS.forEach((day) => {
        PERIODS.forEach((period) => {
          const key = `${day}_${period.startTime}_${period.endTime}`;
          slots.push({
            day,
            startTime: period.startTime,
            endTime: period.endTime,
            periodLabel: period.label,
            isAvailable: !!selectedSlots[key],
          });
        });
      });

      await submitTeacherAvailability({
        teacherId,
        teacherName,
        teacherEmail,
        department,
        academicYear,
        semester: selectedSemester,
        slots,
        maxHoursPerWeek: maxHours,
        notes,
      });

      setSuccessModalOpen(true);
    } catch (err) {
      console.error("Failed to submit availability:", err);
      alert("Failed to submit availability. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================= HEADER HERO ================= */}
      <div className="rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3]">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-900/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur-md mb-3">
              <CalendarClock size={14} className="text-indigo-200" />
              <span>Timetable Planning & Lecture Allocation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Teacher Availability Timetable
            </h1>
            <p className="text-indigo-100/90 text-sm max-w-2xl mt-1.5 leading-relaxed">
              Submit your weekly lecture availability for the creation of the institutional timetable. Click the checkboxes on the timetable form below to declare your available lecture slots.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="p-3.5 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 block">
                Assigned Department
              </span>
              <span className="text-sm font-black text-white flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
                <Building2 size={14} className="text-indigo-300" />
                {department}
              </span>
            </div>

            {existingSubmission && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl backdrop-blur-md text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block">
                  Submission Status
                </span>
                <span className="text-sm font-black text-emerald-100 flex items-center gap-1.5 justify-center sm:justify-start mt-0.5">
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  Received by Admin
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONFIGURATION & PRESET TOOLBAR ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Academic Session & Semester
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option value="Semester 1">Semester 1 (2025/2026)</option>
                  <option value="Semester 2">Semester 2 (2025/2026)</option>
                  <option value="Summer Session">Summer Session (2026)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Max Preferred Teaching Hours / Week
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={4}
                  max={30}
                  step={2}
                  value={maxHours}
                  onChange={(e) => setMaxHours(parseInt(e.target.value) || 16)}
                  className="w-24 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 text-center"
                />
                <span className="text-xs font-semibold text-slate-500">hours/week</span>
              </div>
            </div>
          </div>

          {/* Quick Slot Selection Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Quick Selection Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition border border-emerald-200 dark:border-emerald-800"
              >
                Mark All Available
              </button>
              <button
                type="button"
                onClick={handleSelectMornings}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 transition border border-indigo-200 dark:border-indigo-800"
              >
                Mornings Only
              </button>
              <button
                type="button"
                onClick={handleSelectAfternoons}
                className="px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold text-xs hover:bg-sky-100 transition border border-sky-200 dark:border-sky-800"
              >
                Afternoons Only
              </button>
              <button
                type="button"
                onClick={handleSelectWeekdaysOnly}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition border border-slate-200 dark:border-slate-700"
              >
                Exclude Saturday
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold text-xs hover:bg-red-100 transition border border-red-200 dark:border-red-800"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Live Counters Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
              {availableSlotsCount}
            </div>
            <div>
              <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-100">
                {availableSlotsCount} of {totalSlotsCount} Weekly Slots Selected
              </h3>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-300">
                Total Teaching Capacity: <span className="font-extrabold">{availableHours} hours</span> available for timetabling.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
            <Info size={15} className="text-indigo-600 shrink-0" />
            <span>Click any box on the timetable grid below to toggle your availability.</span>
          </div>
        </div>

        {/* ================= INTERACTIVE TIMETABLE GRID FORM ================= */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-center border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-black uppercase text-slate-600 dark:text-slate-300 tracking-wider">
                <th className="py-3.5 px-4 w-40 text-left border-r border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-indigo-600" />
                    <span>Time Slot</span>
                  </div>
                </th>
                {DAYS.map((day) => (
                  <th key={day} className="py-3.5 px-3 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs">
              {/* Period 1 */}
              <tr>
                <td className="py-4 px-4 text-left font-bold bg-slate-50/70 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700">
                  <span className="block text-[11px] text-indigo-600 dark:text-indigo-400 font-extrabold">Period 1</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">07:30 - 09:30</span>
                </td>
                {DAYS.map((day) => {
                  const key = `${day}_07:30_09:30`;
                  const isChecked = !!selectedSlots[key];
                  return (
                    <td
                      key={key}
                      onClick={() => handleToggleSlot(day, "07:30", "09:30")}
                      className={`p-2.5 border-r border-slate-200 dark:border-slate-700 last:border-r-0 transition cursor-pointer select-none ${
                        isChecked
                          ? "bg-emerald-500/15 hover:bg-emerald-500/25"
                          : "hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent onClick
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer pointer-events-none"
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isChecked
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "text-slate-400 bg-slate-100 dark:bg-slate-800"
                          }`}
                        >
                          {isChecked ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Period 2 */}
              <tr>
                <td className="py-4 px-4 text-left font-bold bg-slate-50/70 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700">
                  <span className="block text-[11px] text-indigo-600 dark:text-indigo-400 font-extrabold">Period 2</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">09:30 - 11:30</span>
                </td>
                {DAYS.map((day) => {
                  const key = `${day}_09:30_11:30`;
                  const isChecked = !!selectedSlots[key];
                  return (
                    <td
                      key={key}
                      onClick={() => handleToggleSlot(day, "09:30", "11:30")}
                      className={`p-2.5 border-r border-slate-200 dark:border-slate-700 last:border-r-0 transition cursor-pointer select-none ${
                        isChecked
                          ? "bg-emerald-500/15 hover:bg-emerald-500/25"
                          : "hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer pointer-events-none"
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isChecked
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "text-slate-400 bg-slate-100 dark:bg-slate-800"
                          }`}
                        >
                          {isChecked ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Institutional Midday Break */}
              <tr className="bg-amber-50/40 dark:bg-amber-950/20 text-slate-500 font-medium">
                <td className="py-2.5 px-4 text-left font-bold text-[11px] text-amber-700 dark:text-amber-400 border-r border-slate-200 dark:border-slate-700">
                  Break (11:30 - 12:45)
                </td>
                <td colSpan={6} className="py-2.5 text-center text-xs text-amber-700/80 dark:text-amber-300/80 font-semibold tracking-wide">
                  ☕ Institutional Lunch & Faculty Intermission
                </td>
              </tr>

              {/* Period 3 */}
              <tr>
                <td className="py-4 px-4 text-left font-bold bg-slate-50/70 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700">
                  <span className="block text-[11px] text-indigo-600 dark:text-indigo-400 font-extrabold">Period 3</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">12:45 - 14:45</span>
                </td>
                {DAYS.map((day) => {
                  const key = `${day}_12:45_14:45`;
                  const isChecked = !!selectedSlots[key];
                  return (
                    <td
                      key={key}
                      onClick={() => handleToggleSlot(day, "12:45", "14:45")}
                      className={`p-2.5 border-r border-slate-200 dark:border-slate-700 last:border-r-0 transition cursor-pointer select-none ${
                        isChecked
                          ? "bg-emerald-500/15 hover:bg-emerald-500/25"
                          : "hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer pointer-events-none"
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isChecked
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "text-slate-400 bg-slate-100 dark:bg-slate-800"
                          }`}
                        >
                          {isChecked ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Period 4 */}
              <tr>
                <td className="py-4 px-4 text-left font-bold bg-slate-50/70 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700">
                  <span className="block text-[11px] text-indigo-600 dark:text-indigo-400 font-extrabold">Period 4</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">14:45 - 16:45</span>
                </td>
                {DAYS.map((day) => {
                  const key = `${day}_14:45_16:45`;
                  const isChecked = !!selectedSlots[key];
                  return (
                    <td
                      key={key}
                      onClick={() => handleToggleSlot(day, "14:45", "16:45")}
                      className={`p-2.5 border-r border-slate-200 dark:border-slate-700 last:border-r-0 transition cursor-pointer select-none ${
                        isChecked
                          ? "bg-emerald-500/15 hover:bg-emerald-500/25"
                          : "hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer pointer-events-none"
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isChecked
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "text-slate-400 bg-slate-100 dark:bg-slate-800"
                          }`}
                        >
                          {isChecked ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ================= NOTES & SUBMISSION BAR ================= */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Special Constraints or Preferred Lecture Labs (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Preferred classrooms (BA2A or Software Lab 1). Cannot teach past 15:00 on Wednesdays due to faculty meetings."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 resize-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
              <span>
                Submission will be routed to the Academic Registry and appear in the Administrator's Timetable Management console.
              </span>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-300 dark:shadow-none transition flex items-center justify-center gap-2 disabled:opacity-50 self-end sm:self-auto cursor-pointer"
            >
              <Send size={16} />
              {submitting ? "Transmitting to Admin..." : "Submit Availability to Admin"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= SUCCESS CONFIRMATION MODAL ================= */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Availability Successfully Transmitted"
        maxWidth="md"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Timetable Availability Received by Admin!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Your weekly availability for <span className="font-bold text-indigo-600">{selectedSemester} ({academicYear})</span> has been submitted to the University Administration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Faculty Instructor:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{teacherName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Available Slots Selected:</span>
              <span className="font-bold text-emerald-600">{availableSlotsCount} of {totalSlotsCount} slots ({availableHours} hrs)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Preferred Target Capacity:</span>
              <span className="font-bold text-indigo-600">{maxHours} hrs/week</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSuccessModalOpen(false)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
};

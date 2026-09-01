import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Clock,
  User,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import type { TimetableSlot } from "../../types";

export const AdminTimetable: React.FC = () => {
  const { timetableSlots, courses, addTimetableSlot, deleteTimetableSlot } =
    useData();

  const [selectedProgram, setSelectedProgram] = useState("Computer Science");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1 (2024/2025)");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<TimetableSlot | null>(null);

  // New slot state
  const [courseCode, setCourseCode] = useState("CS 201");
  const [day, setDay] = useState<TimetableSlot["day"]>("Monday");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [classroom, setClassroom] = useState("Room 101");
  const [lecturerName, setLecturerName] = useState("Dr. Robert Smith");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
  const timeSlots = [
    { start: "08:00", end: "10:00", label: "08:00 - 10:00" },
    { start: "10:00", end: "12:00", label: "10:00 - 12:00" },
    { start: "12:00", end: "13:00", label: "12:00 - 13:00 (Break)" },
    { start: "13:00", end: "14:00", label: "13:00 - 14:00" },
    { start: "14:00", end: "16:00", label: "14:00 - 16:00" },
    { start: "16:00", end: "18:00", label: "16:00 - 18:00" },
  ];

  const getSlot = (dayName: string, start: string) => {
    return timetableSlots.find(
      (s) => s.day === dayName && s.startTime === start
    );
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = courses.find((c) => c.code === courseCode);

    addTimetableSlot({
      courseCode,
      courseTitle: matched?.title || "Computer Course",
      lecturerName,
      classroom,
      day,
      startTime,
      endTime,
      program: selectedProgram,
      semester: selectedSemester,
      color: "bg-indigo-50 border-indigo-200 text-indigo-900",
    });

    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Timetable Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure lecture slots, room allocations, time matrix and conflict avoidance
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          Create Timetable Slot
        </button>
      </div>

      {/* Program and Semester Selectors matching mockup */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Program
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-500"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-500"
            >
              <option value="Semester 1 (2024/2025)">Semester 1 (2024/2025)</option>
              <option value="Semester 2 (2023/2024)">Semester 2 (2023/2024)</option>
            </select>
          </div>
        </div>

        {/* Timetable Matrix matching reference screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse">
            <thead>
              <tr>
                <th className="p-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-36 border-b border-slate-100 bg-slate-50/50 rounded-tl-2xl">
                  Time
                </th>
                {days.map((d, idx) => (
                  <th
                    key={d}
                    className={`p-3.5 text-center text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50 ${
                      idx === days.length - 1 ? "rounded-tr-2xl" : ""
                    }`}
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeSlots.map((time) => {
                if (time.label.includes("Break")) {
                  return (
                    <tr key={time.start} className="bg-slate-50/60">
                      <td className="p-3 text-xs font-bold text-slate-400">
                        {time.start} - {time.end}
                      </td>
                      <td
                        colSpan={5}
                        className="p-3 text-center text-xs font-semibold text-slate-400 italic"
                      >
                        University Mid-day Break
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={time.start} className="h-28">
                    <td className="p-3.5 text-xs font-bold text-slate-500 align-top">
                      {time.label}
                    </td>

                    {days.map((dayName) => {
                      const slot = getSlot(dayName, time.start);

                      return (
                        <td
                          key={dayName}
                          className="p-2 border-l border-slate-100 align-top w-1/5"
                        >
                          {slot ? (
                            <div className="p-3 rounded-2xl border bg-indigo-50/70 border-indigo-200 text-indigo-950 text-left transition hover:shadow-xs group relative">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-black text-indigo-700">
                                  {slot.courseCode}
                                </span>
                                <button
                                  onClick={() => setSlotToDelete(slot)}
                                  className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                                  title="Remove slot"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <h4 className="text-xs font-bold leading-snug">
                                {slot.courseTitle}
                              </h4>
                              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                <MapPin size={11} /> {slot.classroom}
                              </p>
                              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                <User size={11} /> {slot.lecturerName}
                              </p>
                            </div>
                          ) : (
                            <div className="h-full rounded-2xl flex items-center justify-center text-slate-200 text-xs border border-dashed border-slate-100">
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

      {/* Create Slot Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Timetable Slot"
        subtitle="Schedule a course section, lecture room and faculty lecturer"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Course
              </label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Day of Week
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as TimetableSlot["day"])}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="08:00">08:00</option>
                <option value="10:00">10:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="16:00">16:00</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Time
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="10:00">10:00</option>
                <option value="12:00">12:00</option>
                <option value="14:00">14:00</option>
                <option value="16:00">16:00</option>
                <option value="18:00">18:00</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Classroom / Hall
              </label>
              <input
                type="text"
                required
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                placeholder="e.g. Room 101 / Lab 2"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lecturer
              </label>
              <input
                type="text"
                required
                value={lecturerName}
                onChange={(e) => setLecturerName(e.target.value)}
                placeholder="e.g. Dr. Robert Smith"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
            >
              Save Schedule Slot
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Slot Confirmation */}
      <ConfirmDialog
        isOpen={!!slotToDelete}
        onClose={() => setSlotToDelete(null)}
        onConfirm={() => {
          if (slotToDelete) {
            deleteTimetableSlot(slotToDelete.id);
            setSlotToDelete(null);
          }
        }}
        title="Remove Timetable Slot"
        message={`Are you sure you want to remove ${slotToDelete?.courseCode} on ${slotToDelete?.day} at ${slotToDelete?.startTime}?`}
        confirmLabel="Remove"
        isDestructive
      />
    </div>
  );
};

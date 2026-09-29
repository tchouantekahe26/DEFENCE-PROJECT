import React, { useState, useMemo } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { downloadTimetablePDF } from "../../services/timetablePdf";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  User as UserIcon,
  MapPin,
  CheckCircle2,
  Download,
  Send,
  FileText,
  FolderArchive,
  ArrowRight,
  GraduationCap,
  ChevronDown,
  Check,
  Sparkles,
  CalendarClock,
  Building2,
  UserCheck,
  Clock,
  CheckSquare,
} from "lucide-react";
import type { TimetableSlot, TeacherAvailabilitySubmission } from "../../types";

const LEVEL_CLASSES: Record<string, string[]> = {
  "Level 1": ["BA1A", "BA1B"],
  "Level 2": ["BA2A", "BA2B"],
  "Level 3": ["BA3A", "BA3B"],
};

export const AdminTimetable: React.FC = () => {
  const {
    timetableSlots,
    users,
    courses,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    deleteClassTimetable,
    publishTimetableToUsers,
    teacherAvailabilities,
    updateTeacherAvailabilityStatus,
  } = useData();

  // DBMS Classes mapping
  const [levelClasses, setLevelClasses] = useState<Record<string, string[]>>(() => {
    return LEVEL_CLASSES;
  });

  // Navigation Tab: "builder" (interactive grid) or "saved" (saved timetables manager)
  const [activeTab, setActiveTab] = useState<"builder" | "saved">("builder");

  // Selection state
  const [selectedLevel, setSelectedLevel] = useState<"Level 1" | "Level 2" | "Level 3">("Level 1");
  const [selectedClass, setSelectedClass] = useState("BA1A");
  const [selectedSemester, setSelectedSemester] = useState("Semester 1 (2024/2025)");

  // Dropdown button open states
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  // "Create New Timetable" Modal States
  const [createTimetableModalOpen, setCreateTimetableModalOpen] = useState(false);
  const [modalTargetLevel, setModalTargetLevel] = useState<"Level 1" | "Level 2" | "Level 3">("Level 1");
  const [modalTargetClass, setModalTargetClass] = useState("BA1A");
  const [modalTargetSemester, setModalTargetSemester] = useState("Semester 1 (2024/2025)");
  const [clearSlotsForNew, setClearSlotsForNew] = useState(true);

  // New timetable created notification banner
  const [newTimetableBanner, setNewTimetableBanner] = useState<{
    className: string;
    level: string;
  } | null>(null);

  // Clear current class slots dialog
  const [clearCurrentClassConfirmOpen, setClearCurrentClassConfirmOpen] = useState(false);

  // Modals & Feedback
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);
  const [broadcastNotes, setBroadcastNotes] = useState(
    "Please find attached the official academic timetable for Semester 1 (2024/2025). Adhere to all scheduled lecture rooms and times."
  );

  // Deletion confirm dialogs
  const [slotToDelete, setSlotToDelete] = useState<TimetableSlot | null>(null);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);

  // Teacher Availabilities review modal
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [inspectedAvailability, setInspectedAvailability] = useState<TeacherAvailabilitySubmission | null>(null);

  // Active slot editor form state
  const [activeDay, setActiveDay] = useState<TimetableSlot["day"]>("Monday");
  const [activeStartTime, setActiveStartTime] = useState("07:30");
  const [activeEndTime, setActiveEndTime] = useState("09:30");
  const [formCourseCode, setFormCourseCode] = useState("");
  const [formCourseTitle, setFormCourseTitle] = useState("");
  const [formTeacherName, setFormTeacherName] = useState("");
  const [formClassroom, setFormClassroom] = useState("BA2A");
  const [formHoursProgress, setFormHoursProgress] = useState("");

  // Days: Monday through Saturday
  const days: TimetableSlot["day"][] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Official time slots matching the institute schedule
  const timeSlots = [
    { start: "07:30", end: "09:30", label: "07:30-09:30", isBreak: false },
    { start: "09:30", end: "11:30", label: "09:30-11:30", isBreak: false },
    { start: "11:30", end: "12:45", label: "BREAK: 11:30-12:45", isBreak: true },
    { start: "12:45", end: "14:45", label: "12:45-14:45", isBreak: false },
    { start: "14:45", end: "16:45", label: "14:45-16:45", isBreak: false },
  ];

  // All subjects proposed from the database
  const databaseSubjects = useMemo(() => {
    const fromCourses = courses.map((c) => c.title?.trim()).filter(Boolean);
    const fromSlots = timetableSlots.map((s) => s.courseTitle?.trim()).filter(Boolean);
    const combined = Array.from(new Set([...fromCourses, ...fromSlots])).filter(Boolean);
    if (!combined.includes("UML")) combined.push("UML");
    if (!combined.includes("MERISE")) combined.push("MERISE");
    if (!combined.includes("Analog Electronic")) combined.push("Analog Electronic");
    if (!combined.includes("Proba & Stats")) combined.push("Proba & Stats");
    if (!combined.includes("Scientific French")) combined.push("Scientific French");
    if (!combined.includes("PWEB2")) combined.push("PWEB2");
    return combined.sort();
  }, [courses, timetableSlots]);

  // All lecturers proposed from the database
  const databaseLecturers = useMemo(() => {
    const faculty = users.filter((u) => u.role === "teacher").map((u) => u.name?.trim()).filter(Boolean);
    const fromCourses = courses.map((c) => c.lecturerName?.trim()).filter(Boolean);
    const fromSlots = timetableSlots.map((s) => s.lecturerName?.trim()).filter(Boolean);
    const combined = Array.from(new Set([...faculty, ...fromCourses, ...fromSlots])).filter(Boolean);
    if (!combined.includes("Mrs. TCHOUTOUO")) combined.push("Mrs. TCHOUTOUO");
    if (!combined.includes("Mrs. DZEUFACK")) combined.push("Mrs. DZEUFACK");
    if (!combined.includes("Mr. KAPNANG")) combined.push("Mr. KAPNANG");
    if (!combined.includes("Mr. EKITY")) combined.push("Mr. EKITY");
    if (!combined.includes("Mr. BENGONO")) combined.push("Mr. BENGONO");
    if (!combined.includes("Mr. TCHOUA")) combined.push("Mr. TCHOUA");
    return combined.sort();
  }, [users, courses, timetableSlots]);

  // Handle level change -> automatically switch to first class of that level
  const handleLevelChange = (lvl: "Level 1" | "Level 2" | "Level 3") => {
    setSelectedLevel(lvl);
    const available = levelClasses[lvl] || LEVEL_CLASSES[lvl];
    setSelectedClass(available[0] || "BA1A");
  };

  const handleOpenCreateTimetable = () => {
    setModalTargetLevel(selectedLevel);
    const available = levelClasses[selectedLevel] || LEVEL_CLASSES[selectedLevel] || ["BA1A"];
    setModalTargetClass(available[0] || "BA1A");
    setClearSlotsForNew(true);
    setCreateTimetableModalOpen(true);
  };

  const handleConfirmCreateTimetable = (e: React.FormEvent) => {
    e.preventDefault();
    const finalClass = modalTargetClass || "BA1A";

    // If clearSlotsForNew is true, delete existing slots so it's a completely empty timetable
    if (clearSlotsForNew) {
      deleteClassTimetable(finalClass);
    }

    setSelectedLevel(modalTargetLevel);
    setSelectedClass(finalClass);
    setSelectedSemester(modalTargetSemester);
    setActiveTab("builder");
    setCreateTimetableModalOpen(false);

    setNewTimetableBanner({
      className: finalClass,
      level: modalTargetLevel,
    });
  };

  // Filter slots for currently selected class
  const currentClassSlots = useMemo(() => {
    return timetableSlots.filter((s) => {
      if (s.className) {
        return s.className === selectedClass;
      }
      // Fallback: If slots were created before className was assigned, map to BA1A
      return selectedClass === "BA1A";
    });
  }, [timetableSlots, selectedClass]);

  const getSlot = (dayName: string, start: string) => {
    return currentClassSlots.find(
      (s) => s.day === dayName && s.startTime === start
    );
  };

  // When admin clicks on any slot in the grid (empty or filled)
  const handleSlotClick = (dayName: TimetableSlot["day"], start: string, end: string) => {
    const existing = getSlot(dayName, start);
    setActiveDay(dayName);
    setActiveStartTime(start);
    setActiveEndTime(end);

    if (existing) {
      setEditingSlot(existing);
      setFormCourseCode(existing.courseCode || "");
      setFormCourseTitle(existing.courseTitle);
      setFormTeacherName(existing.lecturerName);
      setFormClassroom(existing.classroom);
      setFormHoursProgress(existing.hoursProgress || "");
    } else {
      setEditingSlot(null);
      const defaultSubject = databaseSubjects[0] || "UML";
      setFormCourseTitle(defaultSubject);
      const matchedCourse = courses.find((c) => c.title.toLowerCase() === defaultSubject.toLowerCase());
      setFormCourseCode(matchedCourse?.code || "");
      setFormTeacherName(matchedCourse?.lecturerName || databaseLecturers[0] || "Mrs. TCHOUTOUO");
      setFormClassroom(matchedCourse?.classroom || selectedClass || "BA2A");
      setFormHoursProgress("");
    }

    setSlotModalOpen(true);
  };

  const handleSubjectSelect = (subject: string) => {
    setFormCourseTitle(subject);
    const matched = courses.find((c) => c.title.toLowerCase() === subject.toLowerCase());
    if (matched) {
      setFormCourseCode(matched.code);
      setFormTeacherName(matched.lecturerName);
      if (matched.classroom) setFormClassroom(matched.classroom);
    }
  };

  // Save or update the clicked slot
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();

    const matchedCourse = courses.find((c) => c.title.toLowerCase() === formCourseTitle.toLowerCase());
    const resolvedCourseCode = matchedCourse?.code || formCourseCode || "";

    if (editingSlot) {
      updateTimetableSlot(editingSlot.id, {
        courseCode: resolvedCourseCode,
        courseTitle: formCourseTitle,
        lecturerName: formTeacherName,
        classroom: formClassroom,
        className: selectedClass,
        level: selectedLevel,
        semester: selectedSemester,
        hoursProgress: formHoursProgress.trim() || undefined,
      });
    } else {
      addTimetableSlot({
        courseCode: resolvedCourseCode,
        courseTitle: formCourseTitle,
        lecturerName: formTeacherName,
        classroom: formClassroom,
        day: activeDay,
        startTime: activeStartTime,
        endTime: activeEndTime,
        program: "Computer Science",
        semester: selectedSemester,
        level: selectedLevel,
        className: selectedClass,
        hoursProgress: formHoursProgress.trim() || undefined,
        color: "bg-white border-l-4 border-sky-500 shadow-xs",
      });
    }

    setSlotModalOpen(false);
  };

  // Explicit action: "Save & Keep Timetable"
  const handleSaveAndKeepTimetable = () => {
    setSavedSuccessMessage(
      `Official Timetable for ${selectedClass} (${selectedLevel}) has been securely saved in the Archive!`
    );
    setTimeout(() => setSavedSuccessMessage(null), 6000);
  };

  // Saved timetables list calculation
  const savedTimetables = useMemo(() => {
    const list: {
      className: string;
      level: string;
      slotCount: number;
      courses: string[];
      teachers: string[];
    }[] = [];

    // Loop through all classes across Level 1, Level 2, Level 3
    Object.entries(levelClasses).forEach(([lvl, classList]) => {
      classList.forEach((cls) => {
        const slotsForClass = timetableSlots.filter((s) => {
          if (s.className) return s.className === cls;
          return cls === "BA1A";
        });

        if (slotsForClass.length > 0) {
          const uniqueCourses = Array.from(new Set(slotsForClass.map((s) => s.courseTitle || s.courseCode || "Subject")));
          const uniqueTeachers = Array.from(new Set(slotsForClass.map((s) => s.lecturerName)));
          list.push({
            className: cls,
            level: lvl,
            slotCount: slotsForClass.length,
            courses: uniqueCourses,
            teachers: uniqueTeachers,
          });
        }
      });
    });

    return list;
  }, [timetableSlots, levelClasses]);

  const handleExportPDF = () => {
    downloadTimetablePDF({
      program: `Class ${selectedClass} (${selectedLevel})`,
      semester: selectedSemester,
      slots: currentClassSlots,
    });
  };

  const handlePublishTimetable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    try {
      await publishTimetableToUsers(
        `Class ${selectedClass} (${selectedLevel})`,
        selectedSemester,
        broadcastNotes
      );
      setPublishSuccess(
        `Official Timetable for Class ${selectedClass} (${selectedSemester}) has been published to enrolled students and lecturers.`
      );
      setPublishModalOpen(false);
      setTimeout(() => setPublishSuccess(null), 8000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Brand Gradient & Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
              UNISPHERE Academic Planning
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500 font-medium">Timetable Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Timetable Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Click directly on any schedule slot to assign subjects and teachers.
          </p>
        </div>

        {/* View switcher: Builder vs Saved Archive & Create New Timetable Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              onClick={() => setActiveTab("builder")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "builder"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Calendar size={15} />
              <span>Timetable Builder</span>
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "saved"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <FolderArchive size={15} />
              <span>Saved Timetables</span>
              {savedTimetables.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
                  {savedTimetables.length}
                </span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setInspectedAvailability(teacherAvailabilities[0] || null);
              setAvailabilityModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-bold text-xs shadow-xs transition cursor-pointer"
            title="Inspect submitted teacher availability timetables"
          >
            <CalendarClock size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Teacher Availabilities</span>
            {teacherAvailabilities.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white">
                {teacherAvailabilities.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenCreateTimetable}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-emerald-200 dark:shadow-none transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Create New Timetable</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs transition cursor-pointer"
            title="Download PDF"
          >
            <Download size={15} className="text-indigo-600" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Notifications / Feedback */}
      {savedSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{savedSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActiveTab("saved")}
            className="text-xs font-black text-emerald-700 hover:underline flex items-center gap-1"
          >
            View Saved Timetables <ArrowRight size={13} />
          </button>
        </div>
      )}

      {publishSuccess && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 size={16} className="text-indigo-600" />
            <span>{publishSuccess}</span>
          </div>
          <button
            onClick={() => setPublishSuccess(null)}
            className="text-indigo-700 hover:text-indigo-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ================= TAB 1: TIMETABLE BUILDER ================= */}
      {activeTab === "builder" && (
        <div className="space-y-6">
          {/* New Timetable Created Banner with quick guidance */}
          {newTimetableBanner && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-indigo-950/40 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                      Fresh Timetable
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      New Blank Timetable Opened for Class {newTimetableBanner.className} ({newTimetableBanner.level})
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    All periods are currently empty! Click directly on any period slot below (<strong>+ Fill Slot</strong>) to assign subjects, teachers, and classrooms.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNewTimetableBanner(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition self-start sm:self-auto cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Level & Class Selectors: Two Interactive Buttons */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Timetable Scope & Stream Configuration
                </h3>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  Choose the academic level and class to configure schedule slots
                </p>
              </div>

              {/* Two Selector Buttons Side-by-Side */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* 1. BUTTON TO SELECT LEVEL */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setLevelDropdownOpen(!levelDropdownOpen);
                      setClassDropdownOpen(false);
                    }}
                    className={`w-full sm:w-auto min-w-[210px] flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition shadow-xs group ${
                      levelDropdownOpen
                        ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20"
                        : "bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50/50 border-slate-200 dark:border-slate-700 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                        <GraduationCap size={16} />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block leading-none">
                          Level
                        </span>
                        <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                          {selectedLevel}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      size={17}
                      className={`text-slate-400 group-hover:text-purple-600 transition-transform duration-200 ${
                        levelDropdownOpen ? "rotate-180 text-purple-600" : ""
                      }`}
                    />
                  </button>

                  {/* Level Dropdown Menu */}
                  {levelDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setLevelDropdownOpen(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-full sm:w-60 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-30 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Select Academic Level
                        </div>
                        {(["Level 1", "Level 2", "Level 3"] as const).map((lvl) => {
                          const isSelected = selectedLevel === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => {
                                handleLevelChange(lvl);
                                setLevelDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                                isSelected
                                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <GraduationCap
                                  size={15}
                                  className={isSelected ? "text-white" : "text-slate-400"}
                                />
                                <span>{lvl}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                                    isSelected
                                      ? "bg-white/20 text-white"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                  }`}
                                >
                                  {(levelClasses[lvl] || LEVEL_CLASSES[lvl])[0]}–{(levelClasses[lvl] || LEVEL_CLASSES[lvl])[(levelClasses[lvl] || LEVEL_CLASSES[lvl]).length - 1]}
                                </span>
                                {isSelected && <Check size={14} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* 2. BUTTON TO SELECT CLASS */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setClassDropdownOpen(!classDropdownOpen);
                      setLevelDropdownOpen(false);
                    }}
                    className={`w-full sm:w-auto min-w-[210px] flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition shadow-xs group ${
                      classDropdownOpen
                        ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20"
                        : "bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50/50 border-slate-200 dark:border-slate-700 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                        {selectedClass}
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block leading-none">
                          Class ({selectedLevel})
                        </span>
                        <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                          {selectedClass}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      size={17}
                      className={`text-slate-400 group-hover:text-purple-600 transition-transform duration-200 ${
                        classDropdownOpen ? "rotate-180 text-purple-600" : ""
                      }`}
                    />
                  </button>

                  {/* Class Dropdown Menu */}
                  {classDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setClassDropdownOpen(false)}
                      />
                      <div className="absolute top-full right-0 sm:left-0 mt-2 w-full sm:w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-30 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                          <span>Classes for {selectedLevel}</span>
                          <span className="text-purple-600 font-bold">
                            {(levelClasses[selectedLevel] || LEVEL_CLASSES[selectedLevel] || []).length} streams
                          </span>
                        </div>
                        {(levelClasses[selectedLevel] || LEVEL_CLASSES[selectedLevel] || []).map((cls) => {
                          const isSelected = selectedClass === cls;
                          const slotCount = timetableSlots.filter((s) =>
                            s.className ? s.className === cls : cls === "BA1A"
                          ).length;

                          return (
                            <button
                              key={cls}
                              type="button"
                              onClick={() => {
                                setSelectedClass(cls);
                                setClassDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                                isSelected
                                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] ${
                                    isSelected
                                      ? "bg-white/20 text-white"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {cls}
                                </span>
                                <span>{cls}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                    isSelected
                                      ? "bg-white/20 text-white"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                  }`}
                                >
                                  {slotCount} slots
                                </span>
                                {isSelected && <Check size={14} />}
                              </div>
                            </button>
                          );
                        })}
                        <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              setClassDropdownOpen(false);
                              handleOpenCreateTimetable();
                            }}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition cursor-pointer"
                          >
                            <Plus size={14} />
                            <span>+ Create New Class Timetable</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Current Active Class Info Bar & Save Action */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                  {selectedClass}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    Editing Timetable for {selectedClass} ({selectedLevel})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentClassSlots.length} lecture periods configured • {selectedSemester}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenCreateTimetable}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>New Timetable</span>
                </button>

                {currentClassSlots.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setClearCurrentClassConfirmOpen(true)}
                    className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                    title="Clear all slots for this class to start with an empty timetable"
                  >
                    <Trash2 size={13} />
                    <span className="hidden sm:inline">Reset to Empty</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveAndKeepTimetable}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  <span>Save & Keep Timetable</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPublishModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Send size={14} className="text-indigo-600" />
                  <span>Publish PDF</span>
                </button>
              </div>
            </div>

            {/* Official Header Banner matching Institute Timetable */}
            <div className="text-center py-5 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 font-black text-xs tracking-wider mb-2 shadow-xs">
                IAI
              </div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Inter-States Institute of Higher Education
              </h2>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Cameroon Representation
              </p>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase mt-0.5">
                PAUL BIYA TECHNOLOGICAL CENTRE OF EXCELLENCE
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                P.O. Box 13 719 Yaounde (Cameroon) Tel. (237) 242 72 99 57 - 242 72 99 58
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Website: www.iaicameroun.com • E-mail: contact@iaicameroun.com
              </p>
              <div className="mt-2.5 inline-block px-4 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 font-extrabold text-xs uppercase tracking-wider border border-sky-200 dark:border-sky-800">
                WEEK: 30TH MAR – 4TH APR 2026 {selectedLevel.toUpperCase()} - {selectedClass}
              </div>
            </div>

            {/* Timetable Interactive Grid */}
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[900px] border-collapse border border-slate-300 dark:border-slate-700">
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
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {timeSlots.map((time) => {
                    if (time.isBreak) {
                      return (
                        <tr key={time.start} className="h-12 bg-amber-100/70 dark:bg-amber-950/40 border-y-2 border-amber-300/70">
                          <td className="p-2 text-center text-xs font-black text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 whitespace-nowrap">
                            {time.label}
                          </td>
                          {days.map((dayName) => (
                            <td
                              key={dayName}
                              className="p-2 text-center text-xs font-black tracking-widest text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60 uppercase"
                            >
                              BREAK
                            </td>
                          ))}
                        </tr>
                      );
                    }

                    return (
                      <tr key={time.start} className="h-28">
                        <td className="p-3 text-xs font-bold text-slate-700 dark:text-slate-300 text-center align-middle border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40">
                          {time.label}
                        </td>

                        {days.map((dayName) => {
                          const slot = getSlot(dayName, time.start);

                          return (
                            <td
                              key={dayName}
                              className="p-2 border border-slate-200 dark:border-slate-700 align-top w-[14.2%] min-w-[140px] bg-slate-50/30 dark:bg-slate-900/30"
                            >
                              {slot ? (
                                <div
                                  onClick={() => handleSlotClick(dayName, time.start, time.end)}
                                  className="p-3 rounded-xl border bg-white dark:bg-slate-800 border-l-4 border-l-sky-500 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 transition hover:shadow-md cursor-pointer group relative flex flex-col justify-between min-h-[105px]"
                                >
                                  <div className="w-full text-center">
                                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 tracking-wide uppercase leading-tight line-clamp-2">
                                      {slot.courseTitle}
                                    </h4>
                                    <p className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mt-1 truncate">
                                      {slot.lecturerName}
                                    </p>
                                    <p className="text-[10px] font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                                      Location : <span className="font-bold text-sky-700 dark:text-sky-300">{slot.classroom}</span>
                                    </p>
                                    {slot.hoursProgress && (
                                      <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5 tracking-tight">
                                        {slot.hoursProgress}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSlotToDelete(slot);
                                    }}
                                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-1 absolute top-1 right-1"
                                    title="Remove slot"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSlotClick(dayName, time.start, time.end)}
                                  className="w-full h-full min-h-[6.5rem] rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border-2 border-dashed border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all duration-200 group cursor-pointer p-2"
                                  title={`Click to fill ${dayName} ${time.label}`}
                                >
                                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 flex items-center justify-center transition mb-1 text-slate-400 group-hover:text-indigo-600">
                                    <Plus size={15} className="group-hover:scale-110 transition" />
                                  </div>
                                  <span className="text-[11px] font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                    + Fill Slot
                                  </span>
                                  <span className="text-[9px] text-slate-400 dark:text-slate-500">
                                    Empty period
                                  </span>
                                </button>
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

            {/* Institutional Signatures matching official document */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 font-bold">
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
      )}

      {/* ================= TAB 2: SAVED TIMETABLES DIRECTORY ================= */}
      {activeTab === "saved" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FolderArchive size={20} className="text-indigo-600" />
                  Saved Timetables Directory
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage, update, edit in grid, or delete created class timetables
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateTimetable}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-emerald-200 dark:shadow-none transition flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>+ Create New Timetable</span>
              </button>
            </div>

            {savedTimetables.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <Calendar size={40} className="mx-auto mb-3 text-indigo-400 opacity-60" />
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">No Saved Timetables Yet</h3>
                <p className="text-xs mt-1 max-w-sm mx-auto">
                  Use the Timetable Builder to click on slots, assign subjects and teachers, and click "Save & Keep Timetable".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedTimetables.map((item) => (
                  <div
                    key={item.className}
                    className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 transition group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                            {item.className}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                              {item.level}
                            </span>
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                              Class {item.className}
                            </h4>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {item.slotCount} Periods
                        </span>
                      </div>

                      {/* Course tags */}
                      <div className="space-y-1.5 mb-4">
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          Assigned Subjects:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.courses.map((crs) => (
                            <span
                              key={crs}
                              className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                            >
                              {crs}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLevel(item.level as "Level 1" | "Level 2" | "Level 3");
                          setSelectedClass(item.className);
                          setActiveTab("builder");
                        }}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                      >
                        <Edit2 size={13} />
                        <span>Edit in Grid</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const slots = timetableSlots.filter((s) => s.className === item.className);
                            downloadTimetablePDF({
                              program: `Class ${item.className} (${item.level})`,
                              semester: selectedSemester,
                              slots,
                            });
                          }}
                          className="p-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 transition"
                          title="Export PDF"
                        >
                          <Download size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setClassToDelete(item.className)}
                          className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 transition"
                          title="Delete entire timetable"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: DIRECT CLICK SLOT CONFIGURATION ================= */}
      <Modal
        isOpen={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
        title={editingSlot ? "Edit Timetable Period" : "Assign Subject & Teacher to Slot"}
        subtitle={`Class ${selectedClass} (${selectedLevel}) • ${activeDay} ${activeStartTime} - ${activeEndTime}`}
      >
        <form onSubmit={handleSaveSlot} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject Name (from Database)
            </label>
            <select
              value={formCourseTitle}
              onChange={(e) => {
                const selectedTitle = e.target.value;
                setFormCourseTitle(selectedTitle);
                const matched = courses.find((c) => c.title.toLowerCase() === selectedTitle.toLowerCase());
                if (matched) {
                  setFormCourseCode(matched.code || "");
                  if (matched.lecturerName) setFormTeacherName(matched.lecturerName);
                  if (matched.classroom) setFormClassroom(matched.classroom);
                }
              }}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
            >
              <option value="">-- Choose Subject from Database --</option>
              {databaseSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Lecturer / Teacher (from Database)
            </label>
            <select
              value={formTeacherName}
              onChange={(e) => setFormTeacherName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500"
            >
              <option value="">-- Select Lecturer from Database --</option>
              {databaseLecturers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Lecture Room / Hall
            </label>
            <input
              type="text"
              value={formClassroom}
              onChange={(e) => setFormClassroom(e.target.value)}
              placeholder="e.g. BA2A, Room 101, Lab 2"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hours Progress (optional, e.g. 36/40 hrs)
            </label>
            <input
              type="text"
              value={formHoursProgress}
              onChange={(e) => setFormHoursProgress(e.target.value)}
              placeholder="e.g. 36/40 hrs, 20/40 hrs"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {editingSlot ? (
              <button
                type="button"
                onClick={() => {
                  setSlotToDelete(editingSlot);
                  setSlotModalOpen(false);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
              >
                Delete Slot
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSlotModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition"
              >
                {editingSlot ? "Update Slot" : "Save Slot"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: PUBLISH TIMETABLE PDF ================= */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title="Publish Official Timetable PDF"
        subtitle={`Broadcast class schedule for ${selectedClass} (${selectedLevel})`}
      >
        <form onSubmit={handlePublishTimetable} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <FileText size={15} /> Official Academic PDF Generation
            </p>
            <p className="text-[11px] opacity-90">
              This action generates an official institutional PDF for <strong>Class {selectedClass}</strong> and distributes it via notification to all students and faculty.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Academic Notes / Guidance
            </label>
            <textarea
              value={broadcastNotes}
              onChange={(e) => setBroadcastNotes(e.target.value)}
              rows={3}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPublishModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Publish Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Slot Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!slotToDelete}
        onClose={() => setSlotToDelete(null)}
        onConfirm={() => {
          if (slotToDelete) {
            deleteTimetableSlot(slotToDelete.id);
            setSlotToDelete(null);
          }
        }}
        title="Remove Lecture Slot"
        message={`Are you sure you want to remove ${slotToDelete?.courseCode} on ${slotToDelete?.day} at ${slotToDelete?.startTime}?`}
        confirmLabel="Remove Slot"
        isDestructive={true}
      />

      {/* Confirm Whole Class Timetable Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!classToDelete}
        onClose={() => setClassToDelete(null)}
        onConfirm={() => {
          if (classToDelete) {
            deleteClassTimetable(classToDelete);
            setClassToDelete(null);
          }
        }}
        title={`Delete Timetable for Class ${classToDelete}?`}
        message={`This will permanently remove all scheduled lecture slots for Class ${classToDelete}. This action cannot be undone.`}
        confirmLabel="Delete Timetable"
        isDestructive={true}
      />

      {/* Confirm Clear Current Class to Empty Dialog */}
      <ConfirmDialog
        isOpen={clearCurrentClassConfirmOpen}
        onClose={() => setClearCurrentClassConfirmOpen(false)}
        onConfirm={() => {
          deleteClassTimetable(selectedClass);
          setClearCurrentClassConfirmOpen(false);
          setNewTimetableBanner({
            className: selectedClass,
            level: selectedLevel,
          });
        }}
        title={`Reset Timetable for Class ${selectedClass}?`}
        message={`This will clear all current slots for Class ${selectedClass} so that you have a 100% empty timetable grid ready to fill from scratch.`}
        confirmLabel="Reset to Empty Grid"
        isDestructive={true}
      />

      {/* ================= MODAL: CREATE NEW TIMETABLE ================= */}
      <Modal
        isOpen={createTimetableModalOpen}
        onClose={() => setCreateTimetableModalOpen(false)}
        title="Create New Class Timetable"
        subtitle="Generate a fresh, empty timetable grid with open slots ready to fill"
      >
        <form onSubmit={handleConfirmCreateTimetable} className="space-y-4">
          {/* Level Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Academic Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Level 1", "Level 2", "Level 3"] as const).map((lvl) => {
                const isSelected = modalTargetLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setModalTargetLevel(lvl);
                      const available = levelClasses[lvl] || LEVEL_CLASSES[lvl] || [];
                      setModalTargetClass(available[0] || "");
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300"
                    }`}
                  >
                    <GraduationCap size={14} />
                    <span>{lvl}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Class / Stream Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Target Class / Stream
            </label>
            <select
              value={modalTargetClass}
              onChange={(e) => setModalTargetClass(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 cursor-pointer"
            >
              {(levelClasses[modalTargetLevel] || LEVEL_CLASSES[modalTargetLevel] || []).map((cls) => {
                const count = timetableSlots.filter((s) => s.className === cls).length;
                return (
                  <option key={cls} value={cls}>
                    Class {cls} ({count} existing slots)
                  </option>
                );
              })}
            </select>
          </div>

          {/* Academic Semester */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Academic Term / Semester
            </label>
            <select
              value={modalTargetSemester}
              onChange={(e) => setModalTargetSemester(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
            >
              <option value="Semester 1 (2024/2025)">Semester 1 (2024/2025)</option>
              <option value="Semester 2 (2024/2025)">Semester 2 (2024/2025)</option>
              <option value="Summer Term (2024/2025)">Summer Term (2024/2025)</option>
            </select>
          </div>

          {/* Empty Slot Guarantee */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="clearSlotsCheck"
              checked={clearSlotsForNew}
              onChange={(e) => setClearSlotsForNew(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="clearSlotsCheck" className="text-xs cursor-pointer select-none">
              <strong className="block font-bold">Open with fresh, empty slots</strong>
              Ensure all periods for this class are blank so you can start filling the schedule from scratch.
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCreateTimetableModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-emerald-200 dark:shadow-none transition cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Open Empty Timetable</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= TEACHER AVAILABILITIES MODAL ================= */}
      <Modal
        isOpen={availabilityModalOpen}
        onClose={() => setAvailabilityModalOpen(false)}
        title="Teacher Availability Submissions for Timetable Creation"
        subtitle="Weekly availability timetables submitted by faculty instructors for lecture allocation."
        maxWidth="4xl"
      >
        <div className="space-y-6">
          {teacherAvailabilities.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs">
              <CalendarClock size={28} className="mx-auto mb-2 text-indigo-500 opacity-60" />
              <p className="font-bold text-slate-700 dark:text-slate-300">No Teacher Availabilities Received Yet</p>
              <p className="mt-1">Teachers can submit their weekly availability from the Teacher Portal under 'Submit Availability'.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Teacher selector list */}
              <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 pb-4 lg:pb-0 lg:pr-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Faculty Submissions ({teacherAvailabilities.length})
                </span>
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {teacherAvailabilities.map((sub) => {
                    const isSelected = (inspectedAvailability?.id || teacherAvailabilities[0]?.id) === sub.id;
                    const availableCount = sub.slots.filter((s) => s.isAvailable).length;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => setInspectedAvailability(sub)}
                        className={`p-3 rounded-2xl border transition cursor-pointer select-none ${
                          isSelected
                            ? "bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 shadow-xs"
                            : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                            {sub.teacherName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              sub.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : sub.status === "REVIEWED"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {sub.department} • {sub.semester}
                        </p>
                        <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {availableCount} / {sub.slots.length} slots available
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            {new Date(sub.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Availability Grid View */}
              {inspectedAvailability && (
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-slate-100 text-base">
                        {inspectedAvailability.teacherName}'s Availability Grid
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {inspectedAvailability.department} • Max preferred:{" "}
                        <strong className="text-indigo-600 dark:text-indigo-400">{inspectedAvailability.maxHoursPerWeek || 16} hrs/week</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateTeacherAvailabilityStatus(
                            inspectedAvailability.id,
                            inspectedAvailability.status === "REVIEWED" ? "APPROVED" : "REVIEWED"
                          )
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                      >
                        {inspectedAvailability.status === "REVIEWED" ? "Approve for Timetable" : "Acknowledge as Reviewed"}
                      </button>
                    </div>
                  </div>

                  {inspectedAvailability.notes && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                      <strong>Teacher Notes / Constraints: </strong>
                      {inspectedAvailability.notes}
                    </div>
                  )}

                  {/* Matrix preview */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-center border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                          <th className="py-2.5 px-2 text-left border-r border-slate-200 dark:border-slate-700 w-24">
                            Period
                          </th>
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <th key={d} className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                              {d}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {[
                          { start: "07:30", end: "09:30", label: "07:30 - 09:30" },
                          { start: "09:30", end: "11:30", label: "09:30 - 11:30" },
                          { start: "12:45", end: "14:45", label: "12:45 - 14:45" },
                          { start: "14:45", end: "16:45", label: "14:45 - 16:45" },
                        ].map((p) => (
                          <tr key={p.start}>
                            <td className="py-2 px-2 text-left font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                              {p.label}
                            </td>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                              const slot = inspectedAvailability.slots.find(
                                (s) => s.day === day && s.startTime === p.start
                              );
                              const isAvail = slot ? slot.isAvailable : false;
                              return (
                                <td
                                  key={day}
                                  className={`py-2 px-1 border-r border-slate-200 dark:border-slate-700 last:border-r-0 font-bold ${
                                    isAvail
                                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                      : "text-slate-400 bg-slate-50/50 dark:bg-slate-800/20"
                                  }`}
                                >
                                  {isAvail ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] uppercase font-black">
                                      ✓ Avail
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-300 dark:text-slate-600">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setAvailabilityModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTimetable;

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { Course } from "../../types";

export const StudentCourses: React.FC = () => {
  const { user } = useAuth();
  const { courses, enrollments, registerCourse, dropCourse } = useData();

  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [courseToDrop, setCourseToDrop] = useState<Course | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const studentId = user?.id || "";
  const studentName = user?.name || "Student";

  const registeredCourseIds = enrollments
    .filter((e) => e.studentId === studentId && e.status === "registered")
    .map((e) => e.courseId);

  const registeredCoursesList = courses.filter((c) =>
    registeredCourseIds.includes(c.id)
  );

  const totalCredits = registeredCoursesList.reduce(
    (sum, c) => sum + c.creditHours,
    0
  );

  const filteredCourses = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.lecturerName.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q)
    );
  });

  const handleRegister = async (course: Course) => {
    setLoadingAction(true);
    setFeedbackMsg(null);
    try {
      const res = await registerCourse(course.id, studentId, studentName);
      if (res.success) {
        setFeedbackMsg({ type: "success", text: res.message });
      } else {
        setFeedbackMsg({ type: "error", text: res.message });
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleConfirmDrop = async () => {
    if (!courseToDrop) return;
    setLoadingAction(true);
    try {
      const res = await dropCourse(courseToDrop.id, studentId);
      setFeedbackMsg({ type: "success", text: res.message });
    } finally {
      setLoadingAction(false);
      setCourseToDrop(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Course Management & Registration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse available university courses, enroll, and manage your semester load
          </p>
        </div>

        {/* Credit Hours Summary Card */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base">
            {totalCredits}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Enrolled Credits
            </span>
            <span className="text-xs font-bold text-slate-800">
              {totalCredits} / 24 Max Credits
            </span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold transition ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedbackMsg.type === "success" ? (
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={20} className="text-red-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* ================= REGISTERED COURSES SECTION ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Registered Courses ({registeredCoursesList.length})
            </h2>
            <p className="text-xs text-slate-500">
              Courses you are officially enrolled in for Semester 1 (2024/2025)
            </p>
          </div>
        </div>

        {registeredCoursesList.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
            <BookOpen size={36} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">
              No Courses Registered
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You haven't enrolled in any courses for this semester. Choose from the
              available catalog below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredCoursesList.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 hover:bg-emerald-50/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {c.creditHours} Credits
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                    {c.title}
                  </h3>

                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <User size={13} className="text-slate-400" />
                      {c.lecturerName}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400" />
                      {c.classroom} ({c.scheduleDays})
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedCourse(c)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => setCourseToDrop(c)}
                    disabled={loadingAction}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition"
                    title="Drop Course"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= AVAILABLE COURSE CATALOG ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Available Courses Catalog
            </h2>
            <p className="text-xs text-slate-500">
              Explore and add elective and mandatory semester modules
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
              placeholder="Search code, title, lecturer..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-emerald-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((c) => {
            const isEnrolled = registeredCourseIds.includes(c.id);

            return (
              <div
                key={c.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-emerald-100 group-hover:text-emerald-800 text-slate-800 font-bold text-xs transition">
                      {c.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      {c.creditHours} Credits
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3 leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <User size={13} className="text-slate-400" />
                      {c.lecturerName}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      {c.scheduleDays} • {c.scheduleTime}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400" />
                      {c.classroom}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedCourse(c)}
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
                  >
                    View Syllabus
                  </button>

                  {isEnrolled ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                      <CheckCircle2 size={14} />
                      Enrolled
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegister(c)}
                      disabled={loadingAction}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Plus size={14} />
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={`${selectedCourse.code} — ${selectedCourse.title}`}
          subtitle={`${selectedCourse.creditHours} Credit Hours • ${selectedCourse.department}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Course Description
              </h4>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedCourse.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Lecturer</span>
                <span className="font-bold text-slate-800">{selectedCourse.lecturerName}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Classroom</span>
                <span className="font-bold text-slate-800">{selectedCourse.classroom}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Schedule</span>
                <span className="font-bold text-slate-800">{selectedCourse.scheduleDays}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Time Slot</span>
                <span className="font-bold text-slate-800">{selectedCourse.scheduleTime}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Drop Dialog */}
      <ConfirmDialog
        isOpen={!!courseToDrop}
        onClose={() => setCourseToDrop(null)}
        onConfirm={handleConfirmDrop}
        title="Drop Course"
        message={`Are you sure you want to drop ${courseToDrop?.code} (${courseToDrop?.title})? This will remove your registration and class attendance records for this course.`}
        confirmLabel="Drop Course"
        isDestructive
      />
    </div>
  );
};

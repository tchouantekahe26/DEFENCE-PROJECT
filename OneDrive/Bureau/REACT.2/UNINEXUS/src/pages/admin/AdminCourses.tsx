import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Badge } from "../../components/common/Badge";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import type { Course } from "../../types";

export const AdminCourses: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useData();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [creditHours, setCreditHours] = useState(3);
  const [department, setDepartment] = useState("Computer Science");
  const [faculty, setFaculty] = useState("School of Computing");
  const [level, setLevel] = useState("HND 2");
  const [semester, setSemester] = useState("Semester 1");
  const [lecturerName, setLecturerName] = useState("Dr. Robert Smith");
  const [lecturerId, setLecturerId] = useState("usr-teacher-1");
  const [description, setDescription] = useState("");
  const [classroom, setClassroom] = useState("Room 101");
  const [scheduleDays, setScheduleDays] = useState("Monday, Wednesday");
  const [scheduleTime, setScheduleTime] = useState("08:00 - 10:00");
  const [capacity, setCapacity] = useState(60);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setCode("");
    setTitle("");
    setCreditHours(3);
    setDepartment("Computer Science");
    setLevel("HND 2");
    setDescription("");
    setClassroom("Room 101");
    setCapacity(60);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setCode(c.code);
    setTitle(c.title);
    setCreditHours(c.creditHours);
    setDepartment(c.department);
    setLevel(c.level);
    setLecturerName(c.lecturerName);
    setDescription(c.description);
    setClassroom(c.classroom);
    setScheduleDays(c.scheduleDays);
    setScheduleTime(c.scheduleTime);
    setCapacity(c.capacity);
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        code,
        title,
        creditHours,
        department,
        faculty,
        level,
        semester,
        lecturerName,
        description,
        classroom,
        scheduleDays,
        scheduleTime,
        capacity,
      });
    } else {
      addCourse({
        code,
        title,
        creditHours,
        department,
        faculty,
        level,
        semester,
        lecturerId,
        lecturerName,
        description,
        classroom,
        scheduleDays,
        scheduleTime,
        capacity,
        status: "available",
      });
    }

    setModalOpen(false);
  };

  const filteredCourses = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.lecturerName.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Course Curriculum Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create university courses, assign faculty lecturers and manage class capacities
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          Add New Course
        </button>
      </div>

      {/* Search & Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">
            Course Catalog ({courses.length})
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
              placeholder="Search course code or title..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-3xl border border-slate-200/80 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs">
                    {c.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {c.creditHours} Credits
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mt-1">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <p>
                    <strong className="text-slate-700">Lecturer:</strong>{" "}
                    {c.lecturerName}
                  </p>
                  <p>
                    <strong className="text-slate-700">Room:</strong> {c.classroom} (
                    {c.scheduleDays})
                  </p>
                  <p>
                    <strong className="text-slate-700">Enrolled:</strong>{" "}
                    {c.enrolledCount} / {c.capacity} Students
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                  title="Edit Course"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setCourseToDelete(c)}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                  title="Delete Course"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? "Edit Course" : "Add New Course"}
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Course Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS 301"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Credit Hours
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={creditHours}
                onChange={(e) => setCreditHours(parseInt(e.target.value) || 3)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Course Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Cloud Computing"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Assigned Lecturer
              </label>
              <input
                type="text"
                required
                value={lecturerName}
                onChange={(e) => setLecturerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Classroom / Hall
              </label>
              <input
                type="text"
                required
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description & Syllabus Outline
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
            >
              Save Course
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirm={() => {
          if (courseToDelete) {
            deleteCourse(courseToDelete.id);
            setCourseToDelete(null);
          }
        }}
        title="Delete Course"
        message={`Are you sure you want to delete ${courseToDelete?.code} (${courseToDelete?.title})? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
};

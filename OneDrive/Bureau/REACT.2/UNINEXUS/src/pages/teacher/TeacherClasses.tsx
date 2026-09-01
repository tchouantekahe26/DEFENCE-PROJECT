import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  CalendarCheck,
  Award,
  Search,
  CheckCircle2,
} from "lucide-react";
import type { Course } from "../../types";

export const TeacherClasses: React.FC = () => {
  const { user } = useAuth();
  const { courses, users, marks, enrollments } = useData();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeRosterCourse, setActiveRosterCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState("");

  const teacherId = user?.id || "usr-teacher-1";
  const myClasses = courses.filter(
    (c) => c.lecturerId === teacherId || c.lecturerName.includes("Smith")
  );

  // Enrolled students for selected roster
  const enrolledStudents = users.filter((u) => u.role === "student");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Teaching Classes & Syllabus
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage assigned courses, class rosters, lecture materials and enrollments
        </p>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-xl bg-sky-100 text-sky-800 font-bold text-xs">
                  {cls.code}
                </span>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {cls.creditHours} Credits
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {cls.title}
              </h3>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {cls.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  {cls.scheduleDays} • {cls.scheduleTime}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" />
                  {cls.classroom}
                </p>
                <p className="flex items-center gap-2 font-bold text-slate-800">
                  <Users size={14} className="text-sky-600" />
                  {cls.enrolledCount} Students Enrolled
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedCourse(cls)}
                className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition text-center"
              >
                Syllabus
              </button>
              <button
                onClick={() => setActiveRosterCourse(cls)}
                className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition text-center"
              >
                Student Roster
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Syllabus Modal */}
      {selectedCourse && (
        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={`${selectedCourse.code} — ${selectedCourse.title}`}
          subtitle={`${selectedCourse.creditHours} Credits • ${selectedCourse.classroom}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Course Syllabus & Objectives
              </h4>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedCourse.description}
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-900 space-y-2">
              <h5 className="font-bold">Grading Scheme</h5>
              <p>• Continuous Assessments & Quizzes: 20%</p>
              <p>• Mid-Semester Examination: 20%</p>
              <p>• Laboratory / Projects: 20%</p>
              <p>• Final Examination: 40%</p>
            </div>

            <div className="pt-3 flex justify-end">
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

      {/* Class Roster Modal */}
      {activeRosterCourse && (
        <Modal
          isOpen={!!activeRosterCourse}
          onClose={() => setActiveRosterCourse(null)}
          title={`Enrolled Students — ${activeRosterCourse.code}`}
          subtitle={`${activeRosterCourse.title} • ${activeRosterCourse.enrolledCount} Active Students`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Student ID</th>
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Program</th>
                    <th className="pb-3">Level</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrolledStudents.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-50">
                      <td className="py-3 font-mono font-bold text-sky-700 text-xs">
                        {stu.identifier}
                      </td>
                      <td className="py-3 font-bold text-slate-900 flex items-center gap-2">
                        <img
                          src={
                            stu.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                          }
                          alt={stu.name}
                          className="w-6 h-6 rounded-md object-cover"
                        />
                        {stu.name}
                      </td>
                      <td className="py-3 text-xs text-slate-600">{stu.program}</td>
                      <td className="py-3 text-xs text-slate-600">{stu.level}</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setActiveRosterCourse(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close Roster
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

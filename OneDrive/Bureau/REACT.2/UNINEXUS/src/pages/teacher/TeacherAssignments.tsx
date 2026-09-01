import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import {
  FileEdit,
  Plus,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Send,
} from "lucide-react";
import type { Assignment, AssignmentSubmission } from "../../types";

export const TeacherAssignments: React.FC = () => {
  const { user } = useAuth();
  const {
    assignments,
    submissions,
    courses,
    createAssignment,
    gradeSubmission,
  } = useData();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedAsgForGrading, setSelectedAsgForGrading] = useState<Assignment | null>(null);
  const [selectedSubForGrading, setSelectedSubForGrading] = useState<AssignmentSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(85);
  const [gradeFeedback, setGradeFeedback] = useState<string>("");

  // New assignment form
  const [courseCode, setCourseCode] = useState("CS 201");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("2025-06-15T23:59");
  const [maxScore, setMaxScore] = useState(100);

  const teacherId = user?.id || "usr-teacher-1";
  const teacherName = user?.name || "Dr. Robert Smith";

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const matchedCourse = courses.find((c) => c.code === courseCode);

    createAssignment({
      courseId: matchedCourse?.id || "crs-3",
      courseCode,
      courseTitle: matchedCourse?.title || "Data Structures",
      lecturerId: teacherId,
      lecturerName: teacherName,
      title,
      description,
      dueDate,
      maxScore,
      status: "active",
    });

    setTitle("");
    setDescription("");
    setCreateModalOpen(false);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubForGrading) return;

    gradeSubmission(selectedSubForGrading.id, gradeScore, gradeFeedback);
    setSelectedSubForGrading(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Assignment Management & Grading
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create course deliverables, set deadlines, review student submissions and score work
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-200 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          Create New Assignment
        </button>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((asg) => {
          const asgSubmissions = submissions.filter(
            (s) => s.assignmentId === asg.id
          );

          return (
            <div
              key={asg.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs">
                    {asg.courseCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Max: {asg.maxScore} Pts
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {asg.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {asg.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    Due: {new Date(asg.dueDate).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2 font-bold text-slate-800">
                    <Users size={14} className="text-sky-600" />
                    {asgSubmissions.length} Student Submissions
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedAsgForGrading(asg)}
                  className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Award size={15} />
                  Review Submissions ({asgSubmissions.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Assignment"
        subtitle="Set task description, deadlines and scoring rubrics"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Course
              </label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-sky-500"
              >
                <option value="CS 201">CS 201 — Data Structures</option>
                <option value="CS 202">CS 202 — Database Systems</option>
                <option value="CS 203">CS 203 — Web Development</option>
                <option value="CS 205">CS 205 — AI Fundamentals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Max Score (Points)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={maxScore}
                onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Binary Search Tree Implementation"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Instructions & Rubrics
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail specifications, deliverable formats and grading rubrics..."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500"
            />
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
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Review Submissions Modal */}
      {selectedAsgForGrading && (
        <Modal
          isOpen={!!selectedAsgForGrading}
          onClose={() => setSelectedAsgForGrading(null)}
          title={`Submissions: ${selectedAsgForGrading.title}`}
          subtitle={`${selectedAsgForGrading.courseCode} • Max Score: ${selectedAsgForGrading.maxScore} Pts`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {submissions.filter((s) => s.assignmentId === selectedAsgForGrading.id)
              .length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No submissions received yet from enrolled students.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {submissions
                  .filter((s) => s.assignmentId === selectedAsgForGrading.id)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="py-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {sub.studentName}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {sub.content}
                        </p>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Submitted: {new Date(sub.submissionDate).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {sub.score !== undefined ? (
                          <span className="font-black text-emerald-700 text-sm bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                            {sub.score} / {selectedAsgForGrading.maxScore}
                          </span>
                        ) : (
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                            Ungraded
                          </span>
                        )}

                        <button
                          onClick={() => {
                            setSelectedSubForGrading(sub);
                            setGradeScore(sub.score || 85);
                            setGradeFeedback(sub.feedback || "");
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition shadow-2xs"
                        >
                          Grade
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Grade Single Submission Modal */}
      {selectedSubForGrading && (
        <Modal
          isOpen={!!selectedSubForGrading}
          onClose={() => setSelectedSubForGrading(null)}
          title={`Grade Submission — ${selectedSubForGrading.studentName}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveGrade} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Student Submission Content
              </label>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                {selectedSubForGrading.content}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Score (out of {selectedAsgForGrading?.maxScore || 100})
              </label>
              <input
                type="number"
                min={0}
                max={selectedAsgForGrading?.maxScore || 100}
                value={gradeScore}
                onChange={(e) => setGradeScore(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Instructor Feedback
              </label>
              <textarea
                rows={3}
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                placeholder="Constructive feedback, code review remarks..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500"
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSubForGrading(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
              >
                Save Grade & Feedback
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

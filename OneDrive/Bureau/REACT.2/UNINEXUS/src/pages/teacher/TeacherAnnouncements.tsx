import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import { Megaphone, Plus, Trash2, Calendar, User } from "lucide-react";
import type { Announcement } from "../../types";

export const TeacherAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const { announcements, createAnnouncement, deleteAnnouncement } = useData();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "Academic" | "Exam" | "Events" | "Policy" | "General"
  >("Academic");
  const [priority, setPriority] = useState<"High" | "Normal" | "Low">("Normal");
  const [targetAudience, setTargetAudience] = useState<
    "All" | "Students" | "Teachers" | "Department"
  >("Students");

  const teacherName = user?.name || "Dr. Robert Smith";

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createAnnouncement({
      title,
      description,
      author: teacherName,
      authorRole: "Teacher",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category,
      priority,
      targetAudience,
      department: user?.department || "Computer Science",
    });

    setTitle("");
    setDescription("");
    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Course & Class Announcements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Broadcast lecture schedules, assignment updates and class notices to students
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-200 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          Create Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    anc.priority === "High"
                      ? "danger"
                      : anc.category === "Exam"
                      ? "warning"
                      : "info"
                  }
                >
                  {anc.category}
                </Badge>
                <span className="text-xs text-slate-400">
                  Target: {anc.targetAudience}
                </span>
                <span className="text-xs text-slate-400">• {anc.date}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{anc.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {anc.description}
              </p>
              <p className="text-[11px] text-slate-400">Author: {anc.author}</p>
            </div>

            {anc.author.includes("Smith") && (
              <button
                onClick={() => deleteAnnouncement(anc.id)}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition self-end sm:self-auto"
                title="Delete Announcement"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Broadcast Class Announcement"
        subtitle="Publish a new circular to students or department"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Announcement Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lab Session Rescheduled for Thursday"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="Academic">Academic</option>
                <option value="Exam">Exam</option>
                <option value="Events">Events</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="Students">Students</option>
                <option value="All">All</option>
                <option value="Department">Department</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Announcement Body
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete circular details..."
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
              Publish Announcement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

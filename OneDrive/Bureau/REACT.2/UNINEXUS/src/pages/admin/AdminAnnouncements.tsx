import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import { Megaphone, Plus, Trash2, Calendar, User } from "lucide-react";
import type { Announcement } from "../../types";

export const AdminAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const { announcements, createAnnouncement, deleteAnnouncement } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "Academic" | "Exam" | "Events" | "Policy" | "General"
  >("Academic");
  const [priority, setPriority] = useState<"High" | "Normal" | "Low">("High");
  const [targetAudience, setTargetAudience] = useState<
    "All" | "Students" | "Teachers" | "Department"
  >("All");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createAnnouncement({
      title,
      description,
      author: "Academic Registry & Dean's Office",
      authorRole: "Admin",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category,
      priority,
      targetAudience,
    });

    setTitle("");
    setDescription("");
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            University Broadcast Announcements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish official policy circulars, examination memos and campus bulletins
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          Broadcast Announcement
        </button>
      </div>

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
                      : "primary"
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
              <p className="text-[11px] text-slate-400 font-semibold">
                Issuer: {anc.author} ({anc.authorRole})
              </p>
            </div>

            <button
              onClick={() => deleteAnnouncement(anc.id)}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition self-end sm:self-auto"
              title="Delete Announcement"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast University Announcement"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Circular Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. End of Semester Examination Seating Plan"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 font-bold"
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
                <option value="Policy">Policy</option>
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
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="All">All University</option>
                <option value="Students">Students Only</option>
                <option value="Teachers">Faculty Staff</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Circular Content
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full announcement body and guidelines..."
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
              Publish Circular
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

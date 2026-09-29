import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import {
  Plus,
  Trash2,
  Radio,
  Paperclip,
  CheckCircle2,
} from "lucide-react";

export const TeacherAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const { announcements, courses, createAnnouncement, deleteAnnouncement } = useData();

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
  const [courseCode, setCourseCode] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [broadcastAlert, setBroadcastAlert] = useState<string>("");

  const teacherName = user?.name || "Dr. Sarah Williams";

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    await createAnnouncement({
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
      ...(courseCode ? { courseCode } : {}),
      ...(attachmentUrl ? { attachmentUrl } : {}),
    });

    setTitle("");
    setDescription("");
    setCourseCode("");
    setAttachmentUrl("");
    setCreateModalOpen(false);

    setBroadcastAlert(`Announcement "${title}" broadcasted live in real time to connected students!`);
    setTimeout(() => setBroadcastAlert(""), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Course & Class Announcements
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Radio size={10} className="text-emerald-600 animate-pulse" />
              Live Broadcast Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Broadcast lecture notices, schedule changes and academic bulletins to students instantly
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

      {/* Broadcast Alert */}
      {broadcastAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 font-bold animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          {broadcastAlert}
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
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
                {anc.courseCode && (
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    Course: {anc.courseCode}
                  </span>
                )}
                <span className="text-xs text-slate-400">• {anc.date}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{anc.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed whitespace-pre-line">
                {anc.description || anc.content}
              </p>

              {anc.attachmentUrl && (
                <div className="pt-1">
                  <a
                    href={anc.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-sky-700 hover:text-sky-800 font-bold"
                  >
                    <Paperclip size={13} />
                    View Attachment
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => deleteAnnouncement(anc.id)}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition"
                title="Delete Announcement"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Broadcast Class Announcement"
        subtitle="Publish instant announcements to connected students in real time"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Announcement Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Mathematics Lecture Hall Change"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value as "Academic" | "Exam" | "Events" | "Policy" | "General"
                  )
                }
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
                onChange={(e) => setPriority(e.target.value as "High" | "Normal" | "Low")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) =>
                  setTargetAudience(
                    e.target.value as "All" | "Students" | "Teachers" | "Department"
                  )
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="Students">All Students</option>
                <option value="Department">My Department</option>
                <option value="All">Everyone</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Course (Optional)
            </label>
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            >
              <option value="">-- General / All Courses --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Announcement Message
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete announcement message..."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Attachment Link / URL (Optional)
            </label>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500"
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
              Publish & Broadcast
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

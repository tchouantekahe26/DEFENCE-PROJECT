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

export const AdminAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const { announcements, departments, courses, createAnnouncement, deleteAnnouncement } = useData();

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
  const [department, setDepartment] = useState<string>("Computer Science");
  const [courseCode, setCourseCode] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [broadcastAlert, setBroadcastAlert] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    await createAnnouncement({
      title,
      description,
      author: user?.name || "Academic Registry & Dean's Office",
      authorRole: "Admin",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category,
      priority,
      targetAudience,
      department: targetAudience === "Department" ? department : undefined,
      courseCode: courseCode || undefined,
      attachmentUrl: attachmentUrl || undefined,
    });

    setTitle("");
    setDescription("");
    setCourseCode("");
    setAttachmentUrl("");
    setModalOpen(false);

    setBroadcastAlert(`Broadcast "${title}" published and delivered in real time to connected users!`);
    setTimeout(() => setBroadcastAlert(""), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              University Broadcast Announcements
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Radio size={10} className="text-emerald-600 animate-pulse" />
              Live Broadcast Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Publish official policy circulars, examination memos and campus bulletins to university members
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

      {broadcastAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 font-bold animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          {broadcastAlert}
        </div>
      )}

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
                      : "primary"
                  }
                >
                  {anc.category}
                </Badge>
                <span className="text-xs text-slate-400">
                  Target: {anc.targetAudience}
                </span>
                {anc.department && (
                  <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                    Dept: {anc.department}
                  </span>
                )}
                {anc.courseCode && (
                  <span className="text-xs text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded-md">
                    Course: {anc.courseCode}
                  </span>
                )}
                <span className="text-xs text-slate-400">• {anc.date}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{anc.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed whitespace-pre-line">
                {anc.description || anc.content}
              </p>
              <p className="text-[11px] text-slate-400 font-semibold">
                Issuer: {anc.author} ({anc.authorRole})
              </p>

              {anc.attachmentUrl && (
                <div className="pt-1">
                  <a
                    href={anc.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-800 font-bold"
                  >
                    <Paperclip size={13} />
                    View Attachment
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => deleteAnnouncement(anc.id)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition self-end sm:self-center"
              title="Delete Announcement"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast University Announcement"
        subtitle="This notice will be published to student & faculty dashboards and sent via real-time WebSocket"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. End of Semester Examination Circular"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-500"
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
                <option value="Policy">Policy</option>
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
                onChange={(e) =>
                  setTargetAudience(
                    e.target.value as "All" | "Students" | "Teachers" | "Department"
                  )
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="All">All University</option>
                <option value="Students">All Students</option>
                <option value="Teachers">Faculty / Teachers</option>
                <option value="Department">Specific Department</option>
              </select>
            </div>
          </div>

          {targetAudience === "Department" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              Message Content
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete broadcast details..."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
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
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
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
              Publish Broadcast
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

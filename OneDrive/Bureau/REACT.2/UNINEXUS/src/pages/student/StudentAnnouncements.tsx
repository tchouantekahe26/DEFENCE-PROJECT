import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import {
  Megaphone,
  Search,
  Calendar,
  User,
  CheckCircle2,
  Radio,
  Paperclip,
  Sparkles,
} from "lucide-react";
import type { Announcement } from "../../types";

export const StudentAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const { announcements, enrollments, markAnnouncementAsRead } = useData();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);

  const categories = ["All", "Exam", "Academic", "Events", "Policy", "General"];

  const studentCourseCodes = useMemo(() => {
    return enrollments
      .filter((e) => e.studentId === user?.id && e.status === "registered")
      .map((e) => e.courseCode);
  }, [enrollments, user]);

  // Filter announcements strictly intended for this student
  const myAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      // Exclude notices intended exclusively for teachers
      if (a.targetAudience === "Teachers") return false;

      // Check department targeting
      if (a.targetAudience === "Department" && a.department && user?.department) {
        if (a.department.toLowerCase() !== user.department.toLowerCase()) {
          return false;
        }
      }

      // Check course targeting
      if (a.courseCode && studentCourseCodes.length > 0) {
        if (!studentCourseCodes.includes(a.courseCode)) {
          return false;
        }
      }

      return true;
    });
  }, [announcements, user, studentCourseCodes]);

  const filteredAnnouncements = useMemo(() => {
    return myAnnouncements.filter((a) => {
      const textToMatch = `${a.title} ${a.description || a.content || ""} ${a.author}`.toLowerCase();
      const matchesSearch = textToMatch.includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || a.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [myAnnouncements, search, selectedCategory]);

  const handleOpenAnnouncement = (anc: Announcement) => {
    setActiveAnnouncement(anc);
    markAnnouncementAsRead(anc.id);
  };

  const unreadCount = myAnnouncements.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Broadcast & Announcements
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Radio size={10} className="text-emerald-600 animate-pulse" />
              Live Updates Connected
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Official circulars, lecture updates and examination notices delivered in real time
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
            placeholder="Search announcements..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Category Pills & Unread Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <Sparkles size={13} />
            {unreadCount} unread announcement(s)
          </span>
        )}
      </div>

      {/* Announcement List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <Megaphone size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No Announcements Found</p>
            <p className="text-xs text-slate-400 mt-1">
              You are all caught up! New announcements will appear here instantly when published.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((anc) => (
            <div
              key={anc.id}
              onClick={() => handleOpenAnnouncement(anc)}
              className={`bg-white rounded-3xl p-6 border transition cursor-pointer group hover:shadow-md ${
                !anc.isRead
                  ? "border-indigo-300 bg-gradient-to-r from-indigo-50/30 to-white"
                  : "border-slate-200/80 hover:border-indigo-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
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

                  {!anc.isRead && (
                    <span className="text-[10px] uppercase font-black text-white bg-emerald-600 px-2 py-0.5 rounded-full shadow-2xs">
                      NEW
                    </span>
                  )}

                  {anc.priority === "High" && (
                    <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                      High Priority
                    </span>
                  )}

                  {anc.courseCode && (
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      Course: {anc.courseCode}
                    </span>
                  )}

                  {anc.isRead && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      Read
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <User size={13} />
                    {anc.author} ({anc.authorRole})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {anc.date}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                {anc.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2">
                {anc.description || anc.content}
              </p>

              {anc.attachmentUrl && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <Paperclip size={12} />
                    Attachment included (click to view)
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Announcement Detail Modal */}
      {activeAnnouncement && (
        <Modal
          isOpen={!!activeAnnouncement}
          onClose={() => setActiveAnnouncement(null)}
          title={activeAnnouncement.title}
          subtitle={`Published by ${activeAnnouncement.author} (${activeAnnouncement.authorRole}) on ${activeAnnouncement.date}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="primary">{activeAnnouncement.category}</Badge>
              <span className="text-xs text-slate-500">
                Target: {activeAnnouncement.targetAudience}
              </span>
              {activeAnnouncement.courseCode && (
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  Course: {activeAnnouncement.courseCode}
                </span>
              )}
              {activeAnnouncement.priority === "High" && (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                  High Priority
                </span>
              )}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl whitespace-pre-line text-slate-800 text-sm leading-relaxed">
              {activeAnnouncement.description || activeAnnouncement.content}
            </div>

            {activeAnnouncement.attachmentUrl && (
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <Paperclip size={15} className="text-emerald-600" />
                  Attachment: {activeAnnouncement.attachmentName || "Supporting Document"}
                </div>
                <a
                  href={activeAnnouncement.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                >
                  Download / Open
                </a>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActiveAnnouncement(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

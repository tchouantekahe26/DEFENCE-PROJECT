import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import {
  Megaphone,
  Search,
  Calendar,
  User,
  Filter,
  CheckCircle2,
} from "lucide-react";
import type { Announcement } from "../../types";

export const StudentAnnouncements: React.FC = () => {
  const { announcements, markAnnouncementAsRead } = useData();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);

  const categories = ["All", "Exam", "Academic", "Events", "Policy", "General"];

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || a.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAnnouncement = (anc: Announcement) => {
    setActiveAnnouncement(anc);
    markAnnouncementAsRead(anc.id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            University Announcements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay informed with official circulars, examination notices and university updates
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
            placeholder="Search circulars..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2">
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

      {/* Announcement List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <Megaphone size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No Announcements Found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search keywords or category filters.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((anc) => (
            <div
              key={anc.id}
              onClick={() => handleOpenAnnouncement(anc)}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-200 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
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
                  {anc.priority === "High" && (
                    <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                      High Priority
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
                    {anc.author}
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
                {anc.description}
              </p>
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
          subtitle={`Published by ${activeAnnouncement.author} on ${activeAnnouncement.date}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-sm leading-relaxed text-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">{activeAnnouncement.category}</Badge>
              <span className="text-xs text-slate-500">
                Target: {activeAnnouncement.targetAudience}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl whitespace-pre-line text-slate-800 text-sm leading-relaxed">
              {activeAnnouncement.description}
            </div>

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

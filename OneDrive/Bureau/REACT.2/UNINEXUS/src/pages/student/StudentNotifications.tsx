import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  AlertCircle,
  GraduationCap,
  Calendar,
  FileText,
  ShieldAlert,
  ArrowRight,
  Filter,
} from "lucide-react";

export const StudentNotifications: React.FC = () => {
  const { role } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useData();

  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredNotifications = notifications.filter((n) => {
    const isForRole =
      !n.targetRole || n.targetRole === "all" || n.targetRole === role;
    const matchesCat =
      filterCategory === "all" || n.category === filterCategory;
    return isForRole && matchesCat;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.isRead).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "attendance":
        return <AlertCircle size={18} className="text-amber-600" />;
      case "result":
        return <GraduationCap size={18} className="text-emerald-600" />;
      case "timetable":
        return <Calendar size={18} className="text-sky-600" />;
      case "assignment":
        return <FileText size={18} className="text-indigo-600" />;
      case "emergency":
        return <ShieldAlert size={18} className="text-red-600" />;
      default:
        return <Bell size={18} className="text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Notification Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time notifications, grade announcements and academic reminders
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition self-start sm:self-auto"
          >
            <CheckCheck size={16} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {[
          { key: "all", label: "All Notifications" },
          { key: "result", label: "Grades & Results" },
          { key: "attendance", label: "Attendance" },
          { key: "assignment", label: "Assignments" },
          { key: "announcement", label: "Announcements" },
          { key: "emergency", label: "Emergency" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterCategory(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === tab.key
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell size={36} className="mx-auto mb-2 opacity-30" />
            <h4 className="text-sm font-bold text-slate-700">No Notifications</h4>
            <p className="text-xs text-slate-400 mt-1">You are all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-5 transition hover:bg-slate-50 flex items-start gap-4 cursor-pointer ${
                !notif.isRead ? "bg-emerald-50/20" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getCategoryIcon(notif.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {notif.title}
                  </h4>
                  <span className="text-xs text-slate-400 shrink-0">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>

                {notif.actionLink && (
                  <Link
                    to={notif.actionLink}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline mt-2"
                  >
                    Take Action <ArrowRight size={13} />
                  </Link>
                )}
              </div>

              {!notif.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

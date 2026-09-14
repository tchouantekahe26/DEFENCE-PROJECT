import React, { useRef, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  AlertCircle,
  GraduationCap,
  Calendar,
  FileText,
  ShieldAlert,
} from "lucide-react";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useData();
  const { role } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(
    (n) =>
      !n.targetRole ||
      n.targetRole === "all" ||
      n.targetRole === role
  );

  const unreadCount = filteredNotifications.filter((n) => !n.isRead).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "attendance":
        return <AlertCircle size={16} className="text-amber-600" />;
      case "result":
        return <GraduationCap size={16} className="text-emerald-600" />;
      case "timetable":
        return <Calendar size={16} className="text-sky-600" />;
      case "assignment":
        return <FileText size={16} className="text-indigo-600" />;
      case "emergency":
        return <ShieldAlert size={16} className="text-red-600" />;
      default:
        return <Bell size={16} className="text-indigo-600" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <span className="bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Bell size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs">No notifications yet</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 transition hover:bg-slate-50 cursor-pointer flex gap-3 ${
                !notif.isRead ? "bg-indigo-50/30 dark:bg-indigo-950/30" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getCategoryIcon(notif.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
                {notif.actionLink && (
                  <Link
                    to={notif.actionLink}
                    onClick={onClose}
                    className="inline-block text-[11px] font-semibold text-indigo-600 hover:underline mt-1.5"
                  >
                    View Details →
                  </Link>
                )}
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <Link
          to={`/${role}/notifications`}
          onClick={onClose}
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

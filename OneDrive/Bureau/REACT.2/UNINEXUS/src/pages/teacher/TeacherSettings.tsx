import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User as UserIcon,
  Settings as SettingsIcon,
  Bell,
  Camera,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const TeacherSettings: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security">("profile");

  // Profile fields
  const [name, setName] = useState(user?.name || "Dr. Robert Smith");
  const [email, setEmail] = useState(user?.email || "smith@uninexus.edu");
  const [phone, setPhone] = useState(user?.phone || "+1 555-0145");
  const [department, setDepartment] = useState(user?.department || "Computer Science");
  const [avatar, setAvatar] = useState(
    user?.avatar ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  );
  const [profileSaved, setProfileSaved] = useState(false);

  // Notification Preferences
  const [absenceAlerts, setAbsenceAlerts] = useState(true);
  const [submissionAlerts, setSubmissionAlerts] = useState(true);
  const [departmentAlerts, setDepartmentAlerts] = useState(true);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      department,
      avatar,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePrefsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-sky-200 mb-2">
            <SettingsIcon size={14} />
            Faculty Portal Settings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Settings & Profile
          </h1>
          <p className="text-sky-100 text-sm mt-1">
            Manage your lecturer profile, picture, academic alerts, and portal preferences.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === "profile"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <UserIcon size={16} />
          Profile Details
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === "preferences"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bell size={16} />
          Notifications & Alerts
        </button>
      </div>

      {activeTab === "profile" && (
        <form onSubmit={handleProfileSave} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Lecturer Profile Information
            </h2>

            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="relative">
                <img
                  src={avatar}
                  alt={name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-sky-500/20 shadow-md"
                />
                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center cursor-pointer hover:bg-sky-700 transition shadow-sm">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Profile Avatar Photo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Visible to students and faculty across all course pages.
                </p>
                <div className="mt-3">
                  <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer transition">
                    Upload New Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Staff / Lecturer ID
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.identifier || "TCH102"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {profileSaved && (
              <div className="flex items-center gap-2 text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/40 px-4 py-2 rounded-xl border border-sky-200">
                <CheckCircle2 size={16} />
                Profile Updated!
              </div>
            )}
            <div className="flex-1" />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-200 dark:shadow-none transition flex items-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === "preferences" && (
        <form onSubmit={handlePrefsSave} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Notification Preferences
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Absence Justification Submissions
                  </p>
                  <p className="text-xs text-slate-500">
                    Get real-time notification alerts when a student submits an absence justification request for your courses.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={absenceAlerts}
                  onChange={(e) => setAbsenceAlerts(e.target.checked)}
                  className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Assignment Submissions
                  </p>
                  <p className="text-xs text-slate-500">
                    Notify when student assignment submissions are uploaded.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={submissionAlerts}
                  onChange={(e) => setSubmissionAlerts(e.target.checked)}
                  className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Department Memoranda
                  </p>
                  <p className="text-xs text-slate-500">
                    Receive circulars at {email}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={departmentAlerts}
                  onChange={(e) => setDepartmentAlerts(e.target.checked)}
                  className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-200 dark:shadow-none transition flex items-center gap-2"
            >
              <Save size={16} />
              Save Preferences
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TeacherSettings;

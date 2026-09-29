import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserAvatar, processAvatarUpload } from "../../utils/avatar";
import {
  User as UserIcon,
  Settings as SettingsIcon,
  Bell,
  Camera,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Shield,
  Upload,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";

interface StudentPreferences {
  gradeAlerts: boolean;
  attendanceAlerts: boolean;
  emailNotifs: boolean;
}

export const StudentSettings: React.FC = () => {
  const { user, studentProfile, updateProfile, changePassword, verifyCurrentPassword } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "security">("profile");

  // Profile Edit State
  const [name, setName] = useState(user?.name || "Student");
  const [email, setEmail] = useState(user?.email || "student@uninexus.edu");
  const [phone, setPhone] = useState(user?.phone || "");
  const [department, setDepartment] = useState(user?.department || "Computer Science");
  const [level, setLevel] = useState(user?.level || "HND 1");
  const [avatar, setAvatar] = useState(getUserAvatar(user, "student"));
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
  }, [user?.avatar]);

  // Preferences State (load from localStorage)
  const [gradeAlerts, setGradeAlerts] = useState(() => {
    const saved = localStorage.getItem('studentPreferences');
    return saved ? JSON.parse(saved).gradeAlerts : true;
  });
  const [attendanceAlerts, setAttendanceAlerts] = useState(() => {
    const saved = localStorage.getItem('studentPreferences');
    return saved ? JSON.parse(saved).attendanceAlerts : true;
  });
  const [emailNotifs, setEmailNotifs] = useState(() => {
    const saved = localStorage.getItem('studentPreferences');
    return saved ? JSON.parse(saved).emailNotifs : true;
  });
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Compress and convert image to persistent Base64 string that survives browser reloads
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const dataUrl = await processAvatarUpload(file);
        setAvatar(dataUrl);
        updateProfile({ avatar: dataUrl });
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      } catch (err) {
        console.error("Failed to process avatar", err);
      }
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      department,
      level,
      avatar,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePrefsSave = (e: React.FormEvent) => {
    e.preventDefault();
    const preferences: StudentPreferences = {
      gradeAlerts,
      attendanceAlerts,
      emailNotifs,
    };
    localStorage.setItem('studentPreferences', JSON.stringify(preferences));
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  };

  const handleSecuritySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError("");
    setSecuritySuccess("");

    if (!currentPassword.trim()) {
      setSecurityError("Current password is required");
      return;
    }

    // Verify current password - if not correct, the user cannot replace it
    if (verifyCurrentPassword && !verifyCurrentPassword(currentPassword)) {
      setSecurityError("The current password you entered is incorrect. You cannot replace your password.");
      return;
    }

    if (newPassword.length < 8) {
      setSecurityError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityError("New passwords do not match");
      return;
    }
    if (currentPassword === newPassword) {
      setSecurityError("New password must be different from current password");
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await changePassword?.(currentPassword, newPassword);
      if (result) {
        setSecuritySuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSecuritySuccess(""), 4000);
      }
    } catch (err: any) {
      setSecurityError(err.message || "Failed to update password. Current password may be incorrect.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-900/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
              <SettingsIcon size={14} />
              Account Settings & Profile Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Settings & Profile
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              Manage your student profile information, avatar photo, notifications, and security credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === "profile"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <UserIcon size={16} />
          Profile Information
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === "preferences"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bell size={16} />
          Notifications & Alerts
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === "security"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Shield size={16} />
          Security & Password
        </button>
      </div>

      {/* ================= TAB 1: PROFILE MANAGEMENT ================= */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSave} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Student Profile Details
            </h2>

            {/* Profile Picture Upload & Changer */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="relative">
                <img
                  src={avatar}
                  alt={name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md"
                />
                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition shadow-sm">
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
                  Upload a clear portrait photo (JPG or PNG, max 2MB).
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer transition">
                    Upload New Picture
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

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Student Matric Number
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.identifier || ""}
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Academic Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="HND 1">HND 1 (First Year)</option>
                  <option value="HND 2">HND 2 (Second Year)</option>
                  <option value="Level 100">Level 100</option>
                  <option value="Level 200">Level 200</option>
                  <option value="Level 300">Level 300</option>
                  <option value="Level 400">Level 400</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {profileSaved && (
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <CheckCircle2 size={16} />
                Profile Updated Successfully!
              </div>
            )}
            <div className="flex-1" />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 dark:shadow-none transition flex items-center gap-2"
            >
              <Save size={16} />
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 2: NOTIFICATION PREFERENCES ================= */}
      {activeTab === "preferences" && (
        <form onSubmit={handlePrefsSave} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Notification Settings
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Absence Justification Status Alerts
                  </p>
                  <p className="text-xs text-slate-500">
                    Receive immediate notifications when a teacher or administrator approves or rejects your absence justification.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={attendanceAlerts}
                  onChange={(e) => setAttendanceAlerts(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Grade & Examination Releases
                  </p>
                  <p className="text-xs text-slate-500">
                    Get alerted whenever coursework or end-of-semester exam marks are published.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={gradeAlerts}
                  onChange={(e) => setGradeAlerts(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Email Circulars & Notices
                  </p>
                  <p className="text-xs text-slate-500">
                    Send official department bulletins to {email}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {prefsSaved && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 size={16} />
                Preferences Saved Successfully!
              </div>
            )}
            <div className="flex-1" />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-200 dark:shadow-none transition flex items-center gap-2"
            >
              <Save size={16} />
              Save Notification Preferences
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 3: SECURITY ================= */}
      {activeTab === "security" && (
        <form onSubmit={handleSecuritySave} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 max-w-xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Change Account Password
            </h2>

            {securityError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
                {securityError}
              </div>
            )}
            {securitySuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                {securitySuccess}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (securityError) setSecurityError("");
                    }}
                    placeholder="Enter your current password"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    title={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Default demo password is <span className="font-semibold text-emerald-600 dark:text-emerald-400">password</span>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (securityError) setSecurityError("");
                    }}
                    placeholder="At least 8 characters"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    title={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (securityError) setSecurityError("");
                    }}
                    placeholder="Repeat new password"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2"
            >
              {passwordLoading && <Loader size={16} className="animate-spin" />}
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentSettings;

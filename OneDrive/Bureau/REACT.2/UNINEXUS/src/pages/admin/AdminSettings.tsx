import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User as UserIcon,
  Settings as SettingsIcon,
  Building2,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Camera,
} from "lucide-react";

export const AdminSettings: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "institution" | "security">("profile");

  // Profile fields
  const [name, setName] = useState(user?.name || "Dr. Admin Johnson");
  const [email, setEmail] = useState(user?.email || "admin@uninexus.edu");
  const [phone, setPhone] = useState(user?.phone || "+1 555-0199");
  const [department, setDepartment] = useState(user?.department || "University Administration");
  const [avatar, setAvatar] = useState(
    user?.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  );
  const [profileSaved, setProfileSaved] = useState(false);

  // Institution settings
  const [institutionName, setInstitutionName] = useState("UniNexus University");
  const [supportEmail, setSupportEmail] = useState("registry@uninexus.edu");
  const [securityPhone, setSecurityPhone] = useState("+1 555-0100");
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [instSaved, setInstSaved] = useState(false);

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

  const handleInstSave = (e: React.FormEvent) => {
    e.preventDefault();
    setInstSaved(true);
    setTimeout(() => setInstSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
            <SettingsIcon size={14} />
            Administration Console Settings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Settings & Profile Management
          </h1>
          <p className="text-indigo-100 text-sm mt-1">
            Configure administrator profile details, university parameters, and system security policies.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === "profile"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <UserIcon size={16} />
          Admin Profile
        </button>

        <button
          onClick={() => setActiveTab("institution")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === "institution"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Building2 size={16} />
          Institutional Parameters
        </button>
      </div>

      {activeTab === "profile" && (
        <form onSubmit={handleProfileSave} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Administrator Profile Information
            </h2>

            {/* Profile Picture */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="relative">
                <img
                  src={avatar}
                  alt={name}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
                />
                <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition shadow-sm">
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
                  Profile Picture
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Institutional avatar photo used across administrator actions.
                </p>
                <div className="mt-3">
                  <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer transition">
                    Upload New Avatar
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Staff Identifier
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.identifier || "ADM001"}
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
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {profileSaved && (
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-4 py-2 rounded-xl border border-indigo-200">
                <CheckCircle2 size={16} />
                Profile Updated!
              </div>
            )}
            <div className="flex-1" />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 dark:shadow-none transition flex items-center gap-2"
            >
              <Save size={16} />
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === "institution" && (
        <form onSubmit={handleInstSave} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Institutional Contact & Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  University Name
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Academic Registry Email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Campus Security Dispatch Hotline
                </label>
                <input
                  type="text"
                  value={securityPhone}
                  onChange={(e) => setSecurityPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-red-600 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Session Timeout (Minutes)
                </label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 dark:shadow-none transition flex items-center gap-2"
            >
              <Save size={16} />
              Save Institutional Parameters
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminSettings;

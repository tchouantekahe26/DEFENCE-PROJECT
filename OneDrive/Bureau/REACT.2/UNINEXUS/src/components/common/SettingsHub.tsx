import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { PasswordField } from "./PasswordField";
import {
  Bell,
  Camera,
  Check,
  ChevronRight,
  Globe,
  KeyRound,
  LockKeyhole,
  MessageCircle,
  Save,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

interface SettingsHubProps {
  accent: "emerald" | "sky" | "indigo";
  actorLabel: string;
}

type Section = "account" | "chat" | "privacy" | "notifications" | "language";

export const SettingsHub: React.FC<SettingsHubProps> = ({ accent, actorLabel }) => {
  const { user, updateProfile, changePassword } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.department || "");
  const [avatar, setAvatar] = useState(user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
  const [saved, setSaved] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [badges, setBadges] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");

  const accentClasses = {
    emerald: "bg-emerald-600 hover:bg-emerald-700",
    sky: "bg-sky-600 hover:bg-sky-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
  }[accent];

  const sectionItems: Array<{ id: Section; title: string; subtitle: string; icon: React.ElementType; tone: string }> = [
    { id: "account", title: language === "fr" ? "Compte" : "Account", subtitle: language === "fr" ? "Photo de profil, nom, email et biographie" : "Profile picture, name, email and bio", icon: UserCircle, tone: "bg-sky-500" },
    { id: "chat", title: language === "fr" ? "Paramètres d'Affichage & Chat" : "Chat & Theme Settings", subtitle: language === "fr" ? "Arrière-plan, mode sombre, animations" : "Wallpaper, night mode, animations", icon: MessageCircle, tone: "bg-orange-500" },
    { id: "privacy", title: language === "fr" ? "Confidentialité & Sécurité" : "Privacy & Security", subtitle: language === "fr" ? "Mot de passe et protection du compte" : "Password and account protection", icon: KeyRound, tone: "bg-emerald-500" },
    { id: "notifications", title: language === "fr" ? "Notifications" : "Notifications", subtitle: language === "fr" ? "Alertes, sons et badges" : "Alerts, sounds and badges", icon: Bell, tone: "bg-rose-500" },
    { id: "language", title: language === "fr" ? "Langue" : "Language", subtitle: language === "fr" ? "Français (FR)" : "English (EN)", icon: Globe, tone: "bg-violet-500" },
  ];

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const saveAccount = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile({ name, email, department: bio, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 8 || newPassword !== confirmPassword) {
      setSecurityMessage("Use at least 8 characters and make sure both new passwords match.");
      return;
    }
    try {
      await changePassword?.(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSecurityMessage("Password updated successfully.");
    } catch (error) {
      setSecurityMessage(error instanceof Error ? error.message : "Unable to update password.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 animate-in fade-in duration-200">
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          ← Back to previous page
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{actorLabel}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account and portal preferences.</p>
      </div>

      {!section ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {sectionItems.map(({ id, title, subtitle, icon: Icon, tone }, index) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`flex w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/70 ${index > 0 ? "border-t border-slate-100 dark:border-slate-800" : ""}`}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm ${tone}`}><Icon size={24} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-slate-900 dark:text-slate-100">{title}</span>
                <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">{subtitle}</span>
              </span>
              <ChevronRight className="shrink-0 text-slate-400" size={21} />
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <button type="button" onClick={() => setSection(null)} className="mb-6 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">Back to Settings</button>
          {section === "account" && (
            <form onSubmit={saveAccount} className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Account</h2>
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60 sm:flex-row">
                <div className="relative">
                  <img src={avatar} alt={name} className="h-24 w-24 rounded-3xl object-cover ring-4 ring-sky-500/20" />
                  <label className={`absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white ${accentClasses}`}>
                    <Camera size={16} /><input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
                <div><p className="font-bold text-slate-900 dark:text-slate-100">Profile picture</p><p className="text-sm text-slate-500 dark:text-slate-400">Used across your UniNexus account.</p></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm normal-case text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" /></label>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm normal-case text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" /></label>
              </div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Bio / Department<textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm normal-case text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" /></label>
              <div className="flex items-center justify-end gap-3">{saved && <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600"><Check size={16} /> Saved</span>}<button className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white ${accentClasses}`}><Save size={16} />Save changes</button></div>
            </form>
          )}
          {section === "chat" && (
            <PreferencePanel
              title={language === "fr" ? "Affichage & Mode Sombre" : "Display & Theme Settings"}
              rows={[
                [language === "fr" ? "Fond d'écran" : "Wallpaper", language === "fr" ? "Utiliser l'arrière-plan du portail" : "Use the portal background", true, () => {}],
                [language === "fr" ? "Mode Sombre / Nuit" : "Dark / Night Mode", language === "fr" ? "Activer le thème sombre" : "Keep interface comfortable in low light", isDark, toggleTheme],
                [language === "fr" ? "Animations" : "Animations", language === "fr" ? "Activer les animations de l'interface" : "Play interface animations", animations, () => setAnimations(!animations)],
              ]}
            />
          )}
          {section === "notifications" && (
            <PreferencePanel
              title={language === "fr" ? "Notifications" : "Notifications"}
              rows={[
                [language === "fr" ? "Notifications" : "Notifications", language === "fr" ? "Recevoir les alertes académiques" : "Receive academic and portal alerts", notifications, () => setNotifications(!notifications)],
                [language === "fr" ? "Sons" : "Sounds", language === "fr" ? "Émettre un son de notification" : "Play notification sounds", sounds, () => setSounds(!sounds)],
                [language === "fr" ? "Badges" : "Badges", language === "fr" ? "Afficher les compteurs sur le menu" : "Show unread counts on navigation", badges, () => setBadges(!badges)],
              ]}
            />
          )}
          {section === "language" && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{language === "fr" ? "Langue de l'application" : "Language"}</h2>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {language === "fr" ? "Choisir la langue" : "App language"}
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as "en" | "fr")}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-medium"
                >
                  <option value="en">🇬🇧 English (English)</option>
                  <option value="fr">🇫🇷 Français (French)</option>
                </select>
              </label>
            </div>
          )}
          {section === "privacy" && <form onSubmit={savePassword} className="space-y-5"><h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Privacy & Security</h2><div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"><ShieldCheck size={20} /> Your account security settings</div><PasswordField label="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" /><PasswordField label="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" /><PasswordField label="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />{securityMessage && <p className="text-sm font-semibold text-emerald-600">{securityMessage}</p>}<button className={`rounded-xl px-5 py-3 text-sm font-bold text-white ${accentClasses}`}><LockKeyhole size={16} className="mr-2 inline" />Update password</button></form>}
        </div>
      )}
    </div>
  );
};

const PreferencePanel: React.FC<{ title: string; rows: Array<[string, string, boolean, () => void]> }> = ({ title, rows }) => (
  <div><h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2><div className="divide-y divide-slate-100 dark:divide-slate-800">{rows.map(([label, description, checked, onChange]) => <button type="button" key={label} onClick={onChange} className="flex w-full items-center justify-between gap-4 py-4 text-left"><span><span className="block font-semibold text-slate-900 dark:text-slate-100">{label}</span><span className="text-sm text-slate-500 dark:text-slate-400">{description}</span></span><span className={`h-6 w-11 rounded-full p-1 transition ${checked ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} /></span></button>)}</div></div>
);

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "fr";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LANGUAGE_KEY = "uninexus_language";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav Items
    "nav.dashboard": "Dashboard",
    "nav.user_management": "User Management",
    "nav.timetable_management": "Timetable Management",
    "nav.class_timetable": "Class Timetable",
    "nav.my_timetable": "My Timetable",
    "nav.submit_availability": "Submit Availability",
    "nav.attendance": "Attendance",
    "nav.my_attendance": "My Attendance",
    "nav.absence_justifications": "Absence Justifications",
    "nav.marks_management": "Marks Management",
    "nav.my_marks": "My Marks",
    "nav.announcements": "Announcements",
    "nav.settings": "Settings",
    "nav.sign_out": "Sign Out",

    // Roles & Header
    "role.admin": "ADMINISTRATOR",
    "role.teacher": "FACULTY",
    "role.student": "STUDENT",
    "portal.admin": "Admin Portal",
    "portal.teacher": "Teacher Portal",
    "portal.student": "Student Portal",
    "header.search_admin": "Search users, absences, records...",
    "header.search_teacher": "Search students, absences, courses...",
    "header.search_student": "Search timetable, marks, announcements...",
    "header.theme_to_dark": "Switch to Dark Mode",
    "header.theme_to_light": "Switch to Light Mode",
    "header.language_to_fr": "Switch to French (FR)",
    "header.language_to_en": "Switch to English (EN)",
    "header.language": "Language",
    "header.theme": "Theme",
    "header.sos_active": "SOS Active",
    "header.profile_settings": "View Profile & Settings",
    "header.notifications": "Notifications",

    // Dashboard Hero & Common
    "dashboard.hello": "Hello",
    "dashboard.welcome": "Welcome back",
    "dashboard.faculty_portal": "UNISPHERE Faculty Portal",
    "dashboard.admin_portal": "UNISPHERE Administration",
    "dashboard.student_portal": "UNISPHERE Student Portal",
    "dashboard.show_info": "Show Info",
    "dashboard.hide_info": "Hide Info",
    "dashboard.submit_availability": "Timetable Availability",
    "dashboard.total_students": "Total Students",
    "dashboard.total_faculty": "Total Faculty",
    "dashboard.active_courses": "Assigned Courses",
    "dashboard.registered_courses": "Registered Courses",
    "dashboard.pending_justifications": "Pending Justifications",
    "dashboard.attendance_rate": "Attendance Rate",
    "dashboard.average_gpa": "Cumulative GPA",
    "dashboard.course_sessions": "Course Sessions & Attendance",
    "dashboard.course_sessions_desc": "Quick access to attendance marking for your assigned classes",
    "dashboard.open_marker": "Open marker",
    "dashboard.recent_requests": "Recent Absence Justification Requests",
    "dashboard.recent_requests_desc": "Pending medical certificates and absence notes needing your review",
    "dashboard.review": "Review",
    "dashboard.all_justifications": "All Justifications",
    "dashboard.no_pending_justifications": "All justification requests have been reviewed.",
    "dashboard.view_all_history": "View full history",
    "dashboard.quick_actions": "Quick Actions",
    "dashboard.todays_schedule": "Today's Schedule",
    "dashboard.no_classes_today": "No lectures scheduled today.",
    "dashboard.enter_marks": "Enter Marks",
    "dashboard.view_timetable": "View Timetable",
    "dashboard.mark_attendance": "Mark Attendance",
    "dashboard.manage_users": "Manage Users",
    "dashboard.generate_timetable": "Timetable Generator",

    // Timetable & Days
    "day.monday": "Monday",
    "day.tuesday": "Tuesday",
    "day.wednesday": "Wednesday",
    "day.thursday": "Thursday",
    "day.friday": "Friday",
    "day.saturday": "Saturday",
    "timetable.available": "Available",
    "timetable.unavailable": "Unavailable",
    "timetable.submit": "Submit Availability",
    "timetable.title": "Lecturer Timetable Availability",

    // Settings
    "settings.title": "Settings",
    "settings.app_language": "App Language",
    "settings.select_language": "Choose language",
    "settings.appearance": "Appearance",
    "settings.dark_mode": "Dark Mode",
    "settings.light_mode": "Light Mode",
  },
  fr: {
    // Nav Items
    "nav.dashboard": "Tableau de bord",
    "nav.user_management": "Gestion des utilisateurs",
    "nav.timetable_management": "Emploi du temps",
    "nav.class_timetable": "Emploi du temps",
    "nav.my_timetable": "Mon emploi du temps",
    "nav.submit_availability": "Disponibilités",
    "nav.attendance": "Présences",
    "nav.my_attendance": "Mes présences",
    "nav.absence_justifications": "Justifications d'absence",
    "nav.marks_management": "Gestion des notes",
    "nav.my_marks": "Mes notes",
    "nav.announcements": "Annonces",
    "nav.settings": "Paramètres",
    "nav.sign_out": "Déconnexion",

    // Roles & Header
    "role.admin": "ADMINISTRATEUR",
    "role.teacher": "CORPS ENSEIGNANT",
    "role.student": "ÉTUDIANT",
    "portal.admin": "Portail Administrateur",
    "portal.teacher": "Portail Enseignant",
    "portal.student": "Portail Étudiant",
    "header.search_admin": "Rechercher utilisateurs, absences, dossiers...",
    "header.search_teacher": "Rechercher étudiants, absences, cours...",
    "header.search_student": "Rechercher emploi du temps, notes, annonces...",
    "header.theme_to_dark": "Passer au mode sombre",
    "header.theme_to_light": "Passer au mode clair",
    "header.language_to_fr": "Passer en Français (FR)",
    "header.language_to_en": "Passer en Anglais (EN)",
    "header.language": "Langue",
    "header.theme": "Thème",
    "header.sos_active": "SOS Actif",
    "header.profile_settings": "Profil et paramètres",
    "header.notifications": "Notifications",

    // Dashboard Hero & Common
    "dashboard.hello": "Bonjour",
    "dashboard.welcome": "Bienvenue",
    "dashboard.faculty_portal": "UNISPHERE Portail Enseignant",
    "dashboard.admin_portal": "UNISPHERE Administration",
    "dashboard.student_portal": "UNISPHERE Portail Étudiant",
    "dashboard.show_info": "Afficher",
    "dashboard.hide_info": "Masquer",
    "dashboard.submit_availability": "Disponibilités Emploi du Temps",
    "dashboard.total_students": "Total Étudiants",
    "dashboard.total_faculty": "Corps Enseignant",
    "dashboard.active_courses": "Cours Assignés",
    "dashboard.registered_courses": "Cours Inscrits",
    "dashboard.pending_justifications": "Justificatifs en attente",
    "dashboard.attendance_rate": "Taux de présence",
    "dashboard.average_gpa": "Moyenne Cumulative",
    "dashboard.course_sessions": "Séances de cours & Présences",
    "dashboard.course_sessions_desc": "Accès rapide à la saisie des présences pour vos classes assignées",
    "dashboard.open_marker": "Ouvrir l'appel",
    "dashboard.recent_requests": "Demandes récentes de justification d'absence",
    "dashboard.recent_requests_desc": "Certificats médicaux et motifs d'absence en attente d'examen",
    "dashboard.review": "Examiner",
    "dashboard.all_justifications": "Tous les justificatifs",
    "dashboard.no_pending_justifications": "Toutes les demandes de justification ont été traitées.",
    "dashboard.view_all_history": "Voir l'historique complet",
    "dashboard.quick_actions": "Actions Rapides",
    "dashboard.todays_schedule": "Emploi du temps du jour",
    "dashboard.no_classes_today": "Aucun cours programmé aujourd'hui.",
    "dashboard.enter_marks": "Saisir les notes",
    "dashboard.view_timetable": "Voir l'emploi du temps",
    "dashboard.mark_attendance": "Faire l'appel",
    "dashboard.manage_users": "Gérer les utilisateurs",
    "dashboard.generate_timetable": "Générateur d'emploi du temps",

    // Timetable & Days
    "day.monday": "Lundi",
    "day.tuesday": "Mardi",
    "day.wednesday": "Mercredi",
    "day.thursday": "Jeudi",
    "day.friday": "Vendredi",
    "day.saturday": "Samedi",
    "timetable.available": "Disponible",
    "timetable.unavailable": "Indisponible",
    "timetable.submit": "Soumettre les disponibilités",
    "timetable.title": "Disponibilités de l'enseignant pour l'emploi du temps",

    // Settings
    "settings.title": "Paramètres",
    "settings.app_language": "Langue de l'application",
    "settings.select_language": "Choisir la langue",
    "settings.appearance": "Apparence",
    "settings.dark_mode": "Mode Sombre",
    "settings.light_mode": "Mode Clair",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      if (saved === "fr" || saved === "en") return saved;
      // Default to English, or detect browser
      return "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
      document.documentElement.lang = language;
      window.dispatchEvent(new CustomEvent("uninexus_language_changed", { detail: language }));
    } catch (e) {
      console.error("Language storage error", e);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "fr" : "en"));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = translations.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

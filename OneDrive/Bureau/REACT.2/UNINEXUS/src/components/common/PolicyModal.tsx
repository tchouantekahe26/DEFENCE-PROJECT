import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Scale,
  Clock,
  Sparkles,
  GraduationCap,
} from "lucide-react";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "terms" | "privacy";
  onAccept?: () => void;
  isAgreed?: boolean;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = "terms",
  onAccept,
  isAgreed = false,
}) => {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery("");
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const termsArticles = [
    {
      id: "tos-1",
      title: "1. Acceptance of Terms & Institutional Scope",
      badge: "Binding Agreement",
      content: `By registering for an account, accessing, or utilizing the UNISPHERE Academic Management Platform, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service, university academic regulations, and student/faculty codes of conduct. These terms apply to all registered Students, Faculty/Instructors, Departmental Coordinators, and Administrative Officers. If you do not agree with any provision, you may not proceed with account creation or access university digital services.`,
    },
    {
      id: "tos-2",
      title: "2. Authorized Accounts, Credentials & Identity Security",
      badge: "Security & Access",
      content: `Each account on UNISPHERE is strictly personal and tied to an official matriculation number or institutional faculty identifier. Users are solely responsible for safeguarding their login credentials and authentication factors. 
• Account sharing, proxy login, or delegating account control to any third party is strictly prohibited.
• Impersonation of another student, lecturer, or administrator will result in immediate permanent expulsion and formal referral to institutional disciplinary authorities.
• Users must immediately report any suspected unauthorized access or compromised password to security@unisphere-edu.com.`,
    },
    {
      id: "tos-3",
      title: "3. Academic Integrity & Coursework Submissions",
      badge: "Academic Standards",
      content: `UNISPHERE upholds zero-tolerance policies regarding academic dishonesty. 
• All coursework, assignments, laboratory deliverables, midterm assessments, and project portfolios submitted via the platform must represent the student's own original intellectual effort.
• Plagiarism, unauthorized collaboration, commercial contract cheating, or non-permitted artificial intelligence generation without explicit instructor authorization constitutes severe academic misconduct.
• Submissions may be automatically analyzed via academic verification engines. Violations will result in grade cancellation (0/20 or F) and formal board review.`,
    },
    {
      id: "tos-4",
      title: "4. Attendance Tracking & Digital Logbook Regulations",
      badge: "Attendance Compliance",
      content: `Digital attendance recorded on UNISPHERE is legally binding and constitutes the official university record for semester qualification, continuous assessment, and final examination admittance.
• Students must be present in the designated lecture hall or approved hybrid session during scheduled timetable slots.
• Submitting proxy attendance marks or manipulating geolocation or QR check-in mechanisms is considered academic fraud.
• Reaching the maximum allowable absence threshold for any enrolled course automatically disbars the student from sitting the corresponding semester examination.`,
    },
    {
      id: "tos-5",
      title: "5. Absence Justification & Evidentiary Documentation",
      badge: "Justification Protocol",
      content: `Students requesting regularization of recorded absences must submit formal justifications via the UNISPHERE Absence Justification portal within forty-eight (48) hours of returning to classes.
• All uploaded justification documents (including medical certificates, hospital discharge summaries, official summons, or bereavement documentation) must be genuine, stamped, and verifiable by licensed authorities.
• Submitting forged, altered, or fabricated medical certificates or official documents constitutes criminal forgery and will result in immediate suspension, disciplinary hearing, and potential legal prosecution.
• Approved justifications regularize attendance records but do not exempt students from fulfilling required academic coursework deliverables.`,
    },
    {
      id: "tos-6",
      title: "6. Timetables, Scheduling & Cohort Allocations",
      badge: "Operations",
      content: `Class schedules, examination periods, and room assignments displayed in the UNISPHERE Timetable module are determined by departmental administrators and academic deans.
• The university reserves the right to adjust timetables, instructors, and lecture halls to meet institutional pedagogical needs. Official timetable adjustments will be reflected in real time on the platform.
• Students must follow the timetable assigned to their registered academic level and cohort (e.g. BA1A, BA2B). Attending alternative unassigned sections without administrative approval is not credited.`,
    },
    {
      id: "tos-7",
      title: "7. Intellectual Property & Courseware Distribution",
      badge: "Proprietary Rights",
      content: `All lecture presentations, syllabus materials, video recordings, tutorial sheets, and examination papers uploaded by faculty members remain the exclusive intellectual property of the institution and respective educators.
• Users are granted a revocable, non-exclusive, non-transferable personal license to view course materials solely for individual educational study.
• Copying, selling, sharing to public repositories (such as Course Hero or Scribd), or publicly distributing faculty educational materials without prior written authorization is strictly prohibited.`,
    },
    {
      id: "tos-8",
      title: "8. Acceptable Use & System Integrity",
      badge: "Cyber Security",
      content: `Users agree not to compromise the security, integrity, or availability of the UNISPHERE infrastructure. Prohibited actions include:
• Engaging in denial-of-service (DoS) attempts, rate-limit bypassing, SQL injection, cross-site scripting (XSS), or automated scraping.
• Attempting to reverse-engineer, decompile, or tamper with administrative endpoints, grade calculation logic, or security headers.
• Uploading malicious software, viruses, or inappropriate content through justification attachment portals or profile media fields.`,
    },
    {
      id: "tos-9",
      title: "9. Platform Availability & Technical Maintenance",
      badge: "Service Levels",
      content: `UNISPHERE strives for 99.9% uptime during active academic semesters. Scheduled maintenance windows are announced in advance through platform banners.
• The university is not responsible for student connectivity failure, local hardware malfunction, or personal ISP delays occurring near assignment submission deadlines. Students are advised to submit academic work well in advance of cutoff times.`,
    },
    {
      id: "tos-10",
      title: "10. Disciplinary Sanctions & Account Termination",
      badge: "Sanctions",
      content: `Failure to adhere to these Terms of Service may result in immediate administrative measures, including:
• Formal written warnings placed on the permanent academic transcript.
• Temporary suspension or permanent termination of UNISPHERE digital platform access.
• Referral to the University Disciplinary Council for academic probation, suspension, or formal expulsion.`,
    },
  ];

  const privacyArticles = [
    {
      id: "priv-1",
      title: "1. Institutional Commitment & Data Controller",
      badge: "Data Controller",
      content: `UNISPHERE is committed to maintaining the confidentiality, integrity, and security of all personal, academic, and health-related data entrusted to us by students, faculty, and administrators. This policy governs how information is collected, stored, processed, and safeguarded in strict alignment with international educational data standards, FERPA principles, and national data privacy legislations. The University Academic Council acts as the primary Data Controller.`,
    },
    {
      id: "priv-2",
      title: "2. Categories of Information Collected",
      badge: "Data Collection",
      content: `In order to provide accredited academic management services, UNISPHERE processes the following categories of data:
• Personal Identity Records: Full legal name, institutional matriculation number, employee ID, profile photo, department, academic level, and assigned cohort (e.g. BA1A, BA2C).
• Contact Information: Institutional email address, verified recovery email, and telephone contact numbers.
• Academic & Evaluation Records: Enrolled courses, continuous assessment marks, midterm scores, semester examination results, grade point averages (GPA), and transcripts.
• Attendance & Logbook Telemetry: Lecture check-in timestamps, attendance status (Present, Absent, Excused), and IP connection records.
• Sensitive Absence Justifications: Uploaded medical documents, physician notes, and personal circumstance certifications submitted to excuse absences.`,
    },
    {
      id: "priv-3",
      title: "3. Purpose & Lawful Basis of Processing",
      badge: "Lawful Purpose",
      content: `We collect and process your information exclusively for legitimate institutional and educational purposes:
• Verifying enrollment status, credit accumulation, and graduation eligibility.
• Publishing live academic schedules, room assignments, and faculty allocations.
• Auditing class attendance to satisfy official ministry standards and examination prerequisites.
• Reviewing and securely adjudicating student absence justifications.
• Facilitating real-time notifications regarding timetable modifications and emergency alerts.
• Securing university IT infrastructure against unauthorized intrusions and cyber threats.`,
    },
    {
      id: "priv-4",
      title: "4. Role-Based Access Control (RBAC) & Data Segregation",
      badge: "Access Boundaries",
      content: `Access to student and faculty information on UNISPHERE is governed by strict Role-Based Access Controls (RBAC):
• Student Segregation: Students can only view their own personal profile, course enrollments, attendance records, and personal grades. Under no circumstances can students inspect the grades or attendance justifications of their peers.
• Faculty Access: Lecturers can only access student lists and attendance rosters for the specific courses and cohorts they are assigned to teach.
• Administrative Oversight: Central administrators only access records essential for academic record-keeping and timetable provisioning. Every administrative access event is immutably logged in security audit trails.`,
    },
    {
      id: "priv-5",
      title: "5. Absence Justification Vault & Medical Privacy",
      badge: "Sensitive Data",
      content: `We recognize that absence justifications frequently contain sensitive personal or medical health information.
• All uploaded medical certificates and doctor's notes are stored in an encrypted, access-restricted digital vault with AES-256 encryption at rest.
• Only authorized Academic Review Officers and Departmental Chairs hold decryption keys to inspect uploaded medical proofs.
• Justification documents are never shared publicly or exposed to regular faculty without explicit consent. Following academic audit periods, sensitive medical records are securely expunged in accordance with statutory retention cycles.`,
    },
    {
      id: "priv-6",
      title: "6. Zero Third-Party Commercial Exploitation",
      badge: "No Ad Monetization",
      content: `UNISPHERE maintains an absolute guarantee:
• We NEVER sell, rent, monetize, or lease student or faculty personal data to advertising networks, commercial brokers, or marketing firms.
• UNISPHERE contains no third-party behavioral trackers or commercial advertisements.
• Information is only shared with accredited university bodies or statutory regulatory authorities (e.g. Ministry of Higher Education) where strictly required by academic accreditation laws.`,
    },
    {
      id: "priv-7",
      title: "7. Data Retention & Archival Framework",
      badge: "Data Retention",
      content: `Data retention is determined by academic governance and statutory requirements:
• Transcripts, official grades, and graduation conferral records are retained indefinitely in institutional archives.
• Daily attendance logs and routine semester absence data are maintained for a period of five (5) academic years following cohort graduation.
• Inactive guest or applicant credentials that do not complete matriculation are purged after twelve (12) months.`,
    },
    {
      id: "priv-8",
      title: "8. Data Subject Rights (Access, Correction & Portability)",
      badge: "Your Rights",
      content: `Every registered user is entitled to exercise specific data protection rights under institutional policy:
• Right of Access: You may inspect all personal data and grades associated with your profile at any time.
• Right of Rectification: You may request the prompt correction of inaccurate personal contact details or challenge incorrect attendance marks through standard departmental review procedures.
• Right to Portability: Students in good academic standing may request an official electronic transcript or attendance extract for transfer or employment purposes.`,
    },
    {
      id: "priv-9",
      title: "9. Technical Security & Infrastructure Safeguards",
      badge: "Cyber Security",
      content: `UNISPHERE employs enterprise-grade cybersecurity measures to protect your data:
• Encryption: All data in transit is encrypted using TLS 1.3 cryptographic protocols. Sensitive database fields are protected with AES-256 encryption.
• Password Security: Passwords are salted and hashed using modern bcrypt cryptographic standards; plain-text passwords are never stored or logged.
• Proactive Auditing: Continuous automated vulnerability scans, intrusion detection systems, and perimeter firewalls prevent unauthorized penetration.`,
    },
    {
      id: "priv-10",
      title: "10. Contacting the Data Protection Office",
      badge: "Contact & Inquiries",
      content: `If you have questions, feedback, or wish to exercise your rights regarding data privacy and security on the UNISPHERE platform, please reach out to our dedicated privacy officers:
• Email: privacy@unisphere-edu.com
• Institutional Office: Office of the Registrar & Data Protection Officer, Central Administration Building, Campus Hub.
• Emergency Security Hotline: Available 24/7 for account compromise alerts via security@unisphere-edu.com.`,
    },
  ];

  const currentArticles = activeTab === "terms" ? termsArticles : privacyArticles;
  const filteredArticles = currentArticles.filter(
    (art) =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 px-6 py-5 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <GraduationCap size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight">UNISPHERE</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold text-indigo-100 uppercase tracking-wider">
                    Institutional Governance
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Academic Regulations, Service Terms & Data Protection Charter
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/15">
            <button
              type="button"
              onClick={() => {
                setActiveTab("terms");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "terms"
                  ? "bg-white text-indigo-900 shadow-md"
                  : "text-indigo-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <FileText size={15} />
              <span>Terms of Service</span>
              <span className="px-1.5 py-0.5 rounded-md bg-indigo-100/30 text-[10px] font-semibold">
                10 Articles
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("privacy");
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "privacy"
                  ? "bg-white text-indigo-900 shadow-md"
                  : "text-indigo-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ShieldCheck size={15} />
              <span>Privacy Policy</span>
              <span className="px-1.5 py-0.5 rounded-md bg-indigo-100/30 text-[10px] font-semibold">
                FERPA & GDPR
              </span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={`Search ${activeTab === "terms" ? "terms of service" : "privacy policy"} (e.g. attendance, grades, medical, security)...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center gap-1.5">
            <Clock size={13} className="text-slate-400" />
            <span>Last revised: Sept 2026</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto max-h-[52vh] space-y-6 text-slate-700 dark:text-slate-300 text-sm">
          {/* Quick Summary Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
              <Sparkles size={18} />
            </div>
            <div className="text-xs space-y-1">
              <div className="font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider text-[11px]">
                {activeTab === "terms"
                  ? "Key Summary for Students & Faculty"
                  : "Our Core Privacy Commitment"}
              </div>
              <p className="text-indigo-900/80 dark:text-indigo-300 leading-relaxed">
                {activeTab === "terms"
                  ? "By using UNISPHERE, you agree to uphold academic honesty, preserve credential confidentiality, adhere to official timetable schedules, and provide authentic, verifiable proof for all absence justifications. Forged documents or proxy attendance carry severe disciplinary penalties."
                  : "UNISPHERE never sells, monetizes, or shares your personal data with commercial advertisers. Absence justification certificates and medical records are encrypted with AES-256 and only accessible to accredited academic officers."}
              </p>
            </div>
          </div>

          {/* Filtered Articles */}
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">
                No policy articles matched &quot;{searchQuery}&quot;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold underline cursor-pointer"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      {art.title}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold tracking-wide shrink-0">
                      {art.badge}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed pl-3.5 border-l-2 border-slate-200 dark:border-slate-700">
                    {art.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Institutional Stamp Note */}
          <div className="pt-2 pb-1 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>UNISPHERE Academic Operating System v2.4</span>
            <span>Accredited Higher Education Standard</span>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            {isAgreed ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 size={16} />
                You have accepted these terms
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-500">
                <Scale size={15} />
                Agreement is mandatory to register for an account
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>

            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-200 dark:shadow-none transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>I Understand & Accept Terms</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;

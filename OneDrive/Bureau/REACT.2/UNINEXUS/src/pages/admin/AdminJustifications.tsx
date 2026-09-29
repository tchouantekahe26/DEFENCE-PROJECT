import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  FileText,
  Search,
  Filter,
  User,
  Calendar,
  AlertCircle,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import type { AbsenceJustification, JustificationStatus } from "../../types";

export const AdminJustifications: React.FC = () => {
  const { user } = useAuth();
  const { justifications, courses, users, approveJustification, rejectJustification } = useData();

  const [statusFilter, setStatusFilter] = useState<"ALL" | JustificationStatus>("ALL");
  const [courseFilter, setCourseFilter] = useState<string>("ALL");
  const [teacherFilter, setTeacherFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [activeJustification, setActiveJustification] = useState<AbsenceJustification | null>(null);
  const [viewDocModalOpen, setViewDocModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState("");

  const teachers = useMemo(() => users.filter((u) => u.role === "teacher"), [users]);

  const filteredJustifications = useMemo(() => {
    return justifications.filter((j) => {
      const matchStatus = statusFilter === "ALL" || j.status === statusFilter;
      const matchCourse = courseFilter === "ALL" || j.courseCode === courseFilter;
      const matchTeacher =
        teacherFilter === "ALL" ||
        j.lecturerId === teacherFilter ||
        j.lecturerName.toLowerCase().includes(teacherFilter.toLowerCase());
      const matchSearch =
        j.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.studentMatric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCourse && matchTeacher && matchSearch;
    });
  }, [justifications, statusFilter, courseFilter, teacherFilter, searchQuery]);

  const handleApprove = async (just: AbsenceJustification) => {
    setActionLoading(true);
    try {
      await approveJustification(just.id, user?.name || "Administrator");
      setStatusFeedback(`Justification for ${just.studentName} (${just.courseCode}) has been APPROVED by Administrator.`);
      setTimeout(() => setStatusFeedback(""), 6000);
      setViewDocModalOpen(false);
    } catch (e: any) {
      alert("Error approving justification: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenRejectModal = (just: AbsenceJustification) => {
    setActiveJustification(just);
    setRejectionReason("Document does not sufficiently justify the absence.");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!activeJustification) return;
    setActionLoading(true);
    try {
      await rejectJustification(
        activeJustification.id,
        rejectionReason.trim(),
        user?.name || "Administrator"
      );
      setStatusFeedback(
        `Justification for ${activeJustification.studentName} has been REJECTED by Administrator.`
      );
      setTimeout(() => setStatusFeedback(""), 6000);
      setRejectModalOpen(false);
      setViewDocModalOpen(false);
    } catch (e: any) {
      alert("Error rejecting justification: " + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-900/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
              <ShieldCheck size={14} />
              Administrative Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Absence Justifications Management
            </h1>
            <p className="text-indigo-100 text-sm mt-1 max-w-xl">
              Centralized oversight and audit trail of all student absence justification requests across all academic departments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <p className="text-2xl font-black">
                {justifications.filter((j) => j.status === "PENDING").length}
              </p>
              <p className="text-[11px] uppercase font-bold text-indigo-200">Pending</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <p className="text-2xl font-black">
                {justifications.filter((j) => j.status === "APPROVED").length}
              </p>
              <p className="text-[11px] uppercase font-bold text-indigo-200">Approved</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <p className="text-2xl font-black">
                {justifications.filter((j) => j.status === "REJECTED").length}
              </p>
              <p className="text-[11px] uppercase font-bold text-indigo-200">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {statusFeedback && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <p className="text-sm font-semibold">{statusFeedback}</p>
          </div>
          <button onClick={() => setStatusFeedback("")} className="text-indigo-600 hover:text-indigo-800">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 overflow-x-auto">
            {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {st === "ALL" ? "All Requests" : st}
                {st === "PENDING" && justifications.filter((j) => j.status === "PENDING").length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
                    {justifications.filter((j) => j.status === "PENDING").length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, matric ID, reason, course..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Dropdown Filters (Course, Teacher) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter by Course
            </label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter by Lecturer
            </label>
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Lecturers</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setCourseFilter("ALL");
                setTeacherFilter("ALL");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition w-full text-center"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Justifications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {filteredJustifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            <FileCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="font-bold text-slate-700 dark:text-slate-300">No Justification Records Found</p>
            <p className="text-xs mt-1">There are no absence requests matching your current search and filter settings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Absence Date</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Lecturer</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredJustifications.map((just) => (
                  <tr key={just.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={just.studentAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                          alt={just.studentName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{just.studentName}</p>
                          <p className="text-xs text-slate-400">ID: {just.studentMatric}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {just.absenceDate}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">{just.courseCode}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate block max-w-[140px]">{just.courseTitle}</span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-700 dark:text-slate-300">
                      {just.lecturerName}
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-700 dark:text-slate-300 max-w-xs truncate" title={just.reason}>
                        {just.reason}
                      </p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setActiveJustification(just);
                          setViewDocModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition border border-indigo-200/50 dark:border-indigo-800"
                      >
                        <FileText size={14} />
                        View
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {just.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Clock size={12} />
                          PENDING
                        </span>
                      )}
                      {just.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 size={12} />
                          APPROVED
                        </span>
                      )}
                      {just.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800">
                          <XCircle size={12} />
                          REJECTED
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {just.status !== "APPROVED" && (
                          <button
                            onClick={() => handleApprove(just)}
                            disabled={actionLoading}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition inline-flex items-center gap-1"
                            title="Approve Justification"
                          >
                            <Check size={13} />
                            Approve
                          </button>
                        )}
                        {just.status !== "REJECTED" && (
                          <button
                            onClick={() => handleOpenRejectModal(just)}
                            disabled={actionLoading}
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900 text-red-600 dark:text-red-300 font-bold text-xs transition border border-red-200 dark:border-red-800 inline-flex items-center gap-1"
                            title="Reject Justification"
                          >
                            <X size={13} />
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= VIEW DOCUMENT & DETAILS MODAL ================= */}
      <Modal
        isOpen={viewDocModalOpen}
        onClose={() => setViewDocModalOpen(false)}
        title="Admin Review: Absence Justification"
      >
        {activeJustification && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeJustification.studentAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={activeJustification.studentName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500 shrink-0"
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {activeJustification.studentName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {activeJustification.studentMatric} • {activeJustification.courseCode} ({activeJustification.absenceDate})
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="font-black text-xs uppercase block">{activeJustification.status}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Student Stated Reason
              </label>
              <p className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-700 leading-relaxed">
                {activeJustification.reason}
              </p>
            </div>

            {activeJustification.comment && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Additional Comments
                </label>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700">
                  {activeJustification.comment}
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Supporting Document
              </label>
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {activeJustification.documentName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {formatFileSize(activeJustification.documentSize)} • {activeJustification.documentType}
                    </p>
                  </div>
                </div>

                <a
                  href={activeJustification.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <ExternalLink size={13} />
                  Open Document
                </a>
              </div>

              {/* Embedded Document Preview */}
              <div className="mt-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-3 overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Official Document Inspection
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    {activeJustification.documentType || "PDF Document"}
                  </span>
                </div>

                {activeJustification.documentUrl && (activeJustification.documentUrl.startsWith("data:image") || activeJustification.documentName?.match(/\.(jpg|jpeg|png|webp)$/i)) ? (
                  <div className="max-h-72 overflow-auto rounded-xl bg-white dark:bg-slate-800 p-2 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <img
                      src={activeJustification.documentUrl}
                      alt="Medical Justification Proof"
                      className="max-h-68 max-w-full object-contain rounded-lg shadow-xs"
                    />
                  </div>
                ) : (
                  <div className="h-44 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mb-2">
                      <FileCheck size={24} />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Medical Certificate / Justification Proof
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Verified institutional document uploaded by student
                    </p>
                    <a
                      href={activeJustification.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
                    >
                      <ExternalLink size={12} />
                      Inspect High-Resolution File
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Audit info */}
            {activeJustification.reviewedByName && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-bold">Audit:</span> Last reviewed by {activeJustification.reviewedByName} on {activeJustification.reviewedAt}
                {activeJustification.rejectionReason && (
                  <p className="mt-1 text-red-600 dark:text-red-400">
                    <strong>Rejection Reason:</strong> {activeJustification.rejectionReason}
                  </p>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => handleOpenRejectModal(activeJustification)}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900 text-red-600 dark:text-red-300 font-bold text-xs transition border border-red-200 dark:border-red-800"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleApprove(activeJustification)}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check size={16} />
                Approve (Mark Excused)
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= REJECT REASON MODAL ================= */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Admin Rejection Reason"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Enter administrative reason for rejection. This will be visible to the student.
          </p>

          <div>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection justification..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              disabled={actionLoading}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <X size={15} />
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminJustifications;

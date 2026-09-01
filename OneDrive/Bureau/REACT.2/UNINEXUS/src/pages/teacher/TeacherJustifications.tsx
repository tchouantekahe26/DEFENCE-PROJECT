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
} from "lucide-react";
import type { AbsenceJustification, JustificationStatus } from "../../types";

export const TeacherJustifications: React.FC = () => {
  const { user } = useAuth();
  const { justifications, courses, approveJustification, rejectJustification } = useData();

  const [selectedFilter, setSelectedFilter] = useState<"ALL" | JustificationStatus>("ALL");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [activeJustification, setActiveJustification] = useState<AbsenceJustification | null>(null);
  const [viewDocModalOpen, setViewDocModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState("");

  const teacherId = user?.id || "usr-teacher-1";

  // Filter justifications belonging to courses taught by this lecturer
  const myJustifications = useMemo(() => {
    return justifications.filter((j) => {
      const isMyCourse = j.lecturerId === teacherId || j.lecturerName.includes(user?.name?.split(" ")[1] || "Smith");
      return isMyCourse;
    });
  }, [justifications, teacherId, user]);

  const filteredJustifications = useMemo(() => {
    return myJustifications.filter((j) => {
      const matchStatus = selectedFilter === "ALL" || j.status === selectedFilter;
      const matchCourse = selectedCourseFilter === "ALL" || j.courseCode === selectedCourseFilter;
      const matchSearch =
        j.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.studentMatric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCourse && matchSearch;
    });
  }, [myJustifications, selectedFilter, selectedCourseFilter, searchQuery]);

  const handleApprove = async (just: AbsenceJustification) => {
    setActionLoading(true);
    try {
      await approveJustification(just.id, user?.name || "Dr. Robert Smith");
      setStatusFeedback(`Justification for ${just.studentName} (${just.courseCode}) has been APPROVED. Absence is marked as EXCUSED.`);
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
        user?.name || "Dr. Robert Smith"
      );
      setStatusFeedback(
        `Justification for ${activeJustification.studentName} has been REJECTED. Absence remains NOT EXCUSED.`
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
      <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-sky-200 mb-2">
              <FileCheck size={14} />
              Absence Review Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Absence Justifications
            </h1>
            <p className="text-sky-100 text-sm mt-1 max-w-xl">
              Review and verify absence justification submissions, inspect supporting documents, and update student attendance status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <p className="text-2xl font-black">
                {myJustifications.filter((j) => j.status === "PENDING").length}
              </p>
              <p className="text-[11px] uppercase font-bold text-sky-200">Pending Review</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <p className="text-2xl font-black">
                {myJustifications.filter((j) => j.status === "APPROVED").length}
              </p>
              <p className="text-[11px] uppercase font-bold text-sky-200">Approved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {statusFeedback && (
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 dark:bg-sky-950/40 dark:border-sky-800 text-sky-800 dark:text-sky-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-sky-600 dark:text-sky-400 shrink-0" />
            <p className="text-sm font-semibold">{statusFeedback}</p>
          </div>
          <button onClick={() => setStatusFeedback("")} className="text-sky-600 hover:text-sky-800">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 overflow-x-auto">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedFilter === st
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {st === "ALL" ? "All Requests" : st}
              {st === "PENDING" && myJustifications.filter((j) => j.status === "PENDING").length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
                  {myJustifications.filter((j) => j.status === "PENDING").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search & Course Filter */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, ID, course..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Justifications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {filteredJustifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            <FileCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="font-bold text-slate-700 dark:text-slate-300">No Justification Requests Found</p>
            <p className="text-xs mt-1">There are no absence justification requests matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Absence Date</th>
                  <th className="px-6 py-4">Course / Class</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Supporting Document</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
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
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{just.absenceDate}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">{just.courseCode}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate block max-w-xs">{just.courseTitle}</span>
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
                        View Document
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
                      {just.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(just)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <Check size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenRejectModal(just)}
                            disabled={actionLoading}
                            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 font-bold text-xs transition border border-red-200 dark:border-red-800 inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <X size={14} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveJustification(just);
                            setViewDocModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                        >
                          Review Record
                        </button>
                      )}
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
        title="Student Absence Justification"
      >
        {activeJustification && (
          <div className="space-y-4">
            {/* Student & Absence Header Card */}
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

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Student Reason
              </label>
              <p className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-700 leading-relaxed">
                {activeJustification.reason}
              </p>
            </div>

            {activeJustification.comment && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Additional Student Comments
                </label>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700">
                  {activeJustification.comment}
                </p>
              </div>
            )}

            {/* Document Card */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Uploaded Supporting Document
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
            </div>

            {/* Audit History / Rejection information */}
            {activeJustification.status === "REJECTED" && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200">
                <p className="font-bold mb-1">Rejection Reason:</p>
                <p>{activeJustification.rejectionReason}</p>
                {activeJustification.reviewedByName && (
                  <p className="text-[11px] text-red-500 mt-1 italic">
                    Reviewed by {activeJustification.reviewedByName} on {activeJustification.reviewedAt}
                  </p>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            {activeJustification.status === "PENDING" && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenRejectModal(activeJustification)}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 font-bold text-xs transition border border-red-200 dark:border-red-800"
                >
                  Reject Justification
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(activeJustification)}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check size={16} />
                  Approve (Mark as Excused)
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ================= REJECT REASON MODAL ================= */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Absence Justification"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Please enter a reason for rejecting this absence justification. The student will be notified of this reason and the absence will remain <strong>NOT EXCUSED</strong>.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Rejection Reason
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Document does not sufficiently justify the absence or certificate is expired."
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

export default TeacherJustifications;

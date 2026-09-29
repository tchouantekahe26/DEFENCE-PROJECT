import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import {
  FileCheck,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Calendar,
  BookOpen,
  User,
  X,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import type { AttendanceRecord, AbsenceJustification, JustificationStatus } from "../../types";

export const StudentAbsences: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { attendanceRecords, justifications, submitJustification } = useData();

  const [selectedAbsence, setSelectedAbsence] = useState<AttendanceRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [selectedJustification, setSelectedJustification] = useState<AbsenceJustification | null>(null);

  // Form State
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");
  const [submittedSuccessModalOpen, setSubmittedSuccessModalOpen] = useState(false);

  const studentId = user?.id || "";

  const isMe = (item: { studentId?: string; matricNumber?: string; studentName?: string }) => {
    if (!item) return false;
    if (studentId && (item.studentId === studentId || String(item.studentId) === String(studentId))) return true;
    if (user?.identifier && item.matricNumber && item.matricNumber.trim().toUpperCase() === user.identifier.trim().toUpperCase()) return true;
    if (user?.name && item.studentName && item.studentName.trim().toUpperCase() === user.name.trim().toUpperCase()) return true;
    return false;
  };

  // Filter absences for this student
  const myAbsences = attendanceRecords.filter(
    (a) => isMe(a) && a.status.toLowerCase() === "absent"
  );

  // Match absence to justification
  const getJustificationForAbsence = (absence: AttendanceRecord): AbsenceJustification | undefined => {
    return justifications.find(
      (j) => (j.absenceId === absence.id || j.id === absence.justificationId) && isMe(j)
    );
  };

  const getStatusBadge = (absence: AttendanceRecord, justification?: AbsenceJustification) => {
    if (!justification || justification.status === "NOT_JUSTIFIED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <AlertCircle size={13} />
          UNJUSTIFIED
        </span>
      );
    }
    if (justification.status === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Clock size={13} />
          PENDING
        </span>
      );
    }
    if (justification.status === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 size={13} />
          EXCUSED
        </span>
      );
    }
    if (justification.status === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800">
          <XCircle size={13} />
          NOT EXCUSED
        </span>
      );
    }
  };

  const handleOpenJustifyModal = (absence: AttendanceRecord) => {
    const existing = getJustificationForAbsence(absence);
    if (existing && (existing.status === "PENDING" || existing.status === "APPROVED")) {
      alert(`A justification for this absence is already ${existing.status}. You cannot submit a duplicate request.`);
      return;
    }

    setSelectedAbsence(absence);
    setReason("");
    setComment("");
    setFile(null);
    setFileError("");
    setFormError("");
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
      const ext = selectedFile.name.split(".").pop()?.toLowerCase();

      if (!ext || !allowedExtensions.includes(ext)) {
        setFileError("Invalid format. Please upload a PDF, JPG, JPEG, or PNG file.");
        setFile(null);
        return;
      }

      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
      if (selectedFile.size > MAX_SIZE) {
        setFileError("File exceeds maximum allowed size of 5 MB.");
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmitJustification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAbsence) return;

    if (!reason.trim()) {
      setFormError("Please provide a valid reason for your absence.");
      return;
    }

    if (!file) {
      setFileError("Supporting document is required to justify an absence.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const readFileAsDataUrl = (f: File): Promise<string> =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve(URL.createObjectURL(f));
          reader.readAsDataURL(f);
        });

      const docDataUrl = await readFileAsDataUrl(file);

      await submitJustification({
        absenceId: selectedAbsence.id,
        studentId: user?.id || "",
        studentName: user?.name || "Student",
        studentMatric: user?.identifier || "STU-001",
        studentAvatar: user?.avatar,
        courseId: selectedAbsence.courseId,
        courseCode: selectedAbsence.courseCode,
        courseTitle: selectedAbsence.courseTitle || selectedAbsence.courseCode,
        lecturerId: selectedAbsence.lecturerId || "usr-teacher-tchoutouo",
        lecturerName: selectedAbsence.lecturerName || "Mrs. TCHOUTOUO",
        absenceDate: selectedAbsence.date,
        reason: reason.trim(),
        comment: comment.trim(),
        documentUrl: docDataUrl,
        documentName: file.name,
        documentType: file.type || file.name.split(".").pop() || "application/pdf",
        documentSize: file.size,
      });

      setModalOpen(false);
      setSubmittedSuccessModalOpen(true);
      setSuccessBanner(
        "Your absence justification has been submitted successfully and is awaiting review."
      );
      setTimeout(() => setSuccessBanner(""), 9000);
    } catch (err: any) {
      setFormError(err.message || "Failed to submit absence justification.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Back Navigation Bar with (X) Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs transition active:scale-95 group"
          title="Return to previous page"
        >
          <div className="w-5 h-5 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition">
            <X size={13} className="text-slate-600" />
          </div>
          <span>Back to Previous Page</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-900/40 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2">
              <FileCheck size={14} />
              Attendance & Absence Records
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Absence & Justifications
            </h1>
            <p className="text-indigo-100 text-sm mt-1 max-w-xl">
              Track your absence history, submit official supporting documentation (medical slips, certificates), and track reviewer status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <p className="text-2xl font-black">{myAbsences.length}</p>
              <p className="text-[11px] uppercase font-bold text-indigo-200">Total Absences</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <p className="text-2xl font-black">
                {myAbsences.filter((a) => getJustificationForAbsence(a)?.status === "APPROVED").length}
              </p>
              <p className="text-[11px] uppercase font-bold text-indigo-200">Excused</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner with (X) Back Button */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-900">{successBanner}</p>
              <p className="text-xs text-emerald-700">Click the (X) button to return to your previous page.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95"
              title="Go back to previous page"
            >
              <X size={14} />
              <span>Back to Previous Page</span>
            </button>
            <button
              type="button"
              onClick={() => setSuccessBanner("")}
              className="p-1.5 text-emerald-600 hover:text-emerald-900 rounded-lg transition"
              title="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Absences Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Recorded Absences
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review any class sessions you missed and submit timely justifications.
            </p>
          </div>
        </div>

        {myAbsences.length === 0 ? (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-bold text-slate-700 dark:text-slate-300">Perfect Attendance Record!</p>
            <p className="text-xs mt-1">You have no recorded absences on file.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Date of Absence</th>
                  <th className="px-6 py-4">Course / Class</th>
                  <th className="px-6 py-4">Teacher</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Document</th>
                  <th className="px-6 py-4">Submitted On</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {myAbsences.map((absence) => {
                  const just = getJustificationForAbsence(absence);
                  const isPending = just?.status === "PENDING";
                  const isApproved = just?.status === "APPROVED";
                  const isRejected = just?.status === "REJECTED";
                  const isUnjustified = !just || just.status === "NOT_JUSTIFIED";

                  return (
                    <tr key={absence.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-slate-400" />
                          <span>{absence.date}</span>
                          <span className="text-xs text-slate-400">({absence.session})</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          {absence.courseCode}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block truncate max-w-xs">
                          {absence.courseTitle || "Computer Science Lecture"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-slate-400" />
                          <span>{absence.lecturerName || "Mrs. TCHOUTOUO"}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(absence, just)}
                      </td>

                      <td className="px-6 py-4">
                        {just?.documentName ? (
                          <button
                            onClick={() => {
                              setSelectedJustification(just);
                              setViewDetailsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                          >
                            <FileText size={14} />
                            <span className="truncate max-w-[120px]">{just.documentName}</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">None attached</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {just?.submittedAt || "—"}
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {isUnjustified ? (
                          <button
                            onClick={() => handleOpenJustifyModal(absence)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-1.5"
                          >
                            <PlusCircle size={14} />
                            Justify Absence
                          </button>
                        ) : isRejected ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedJustification(just);
                                setViewDetailsModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                            >
                              Reason
                            </button>
                            <button
                              onClick={() => handleOpenJustifyModal(absence)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm"
                            >
                              Resubmit
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedJustification(just);
                              setViewDetailsModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                          >
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= JUSTIFY ABSENCE SUBMISSION MODAL ================= */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Absence Justification"
      >
        {selectedAbsence && (
          <form onSubmit={handleSubmitJustification} className="space-y-4">
            {/* Absence Details Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Absence Date:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedAbsence.date} ({selectedAbsence.session})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Course:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedAbsence.courseCode} - {selectedAbsence.courseTitle || "Course"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Lecturer:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedAbsence.lecturerName || "Mrs. TCHOUTOUO"}</span>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
                {formError}
              </div>
            )}

            {/* Reason Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Reason for Absence <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you missed this class session (e.g., medical emergency, hospitalization, family bereavement)..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition"
              />
            </div>

            {/* Optional Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Additional Comments / Remarks (Optional)
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Doctor's note from Dr. Evans attached"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition"
              />
            </div>

            {/* Supporting Document Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Supporting Document (Medical Cert / Letter) <span className="text-red-500">*</span>
              </label>

              {!file ? (
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/30 group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Upload size={22} />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Click to browse or drag file here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Allowed formats: PDF, JPG, JPEG, PNG (Max size: 5 MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {formatFileSize(file.size)} • {file.type || "Document"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                    title="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {fileError && (
                <p className="text-xs text-red-600 font-semibold mt-1.5">{fileError}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Justification"}
                <ArrowRight size={15} />
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ================= VIEW JUSTIFICATION DETAILS MODAL ================= */}
      <Modal
        isOpen={viewDetailsModalOpen}
        onClose={() => setViewDetailsModalOpen(false)}
        title="Absence Justification Details"
      >
        {selectedJustification && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">
                  Course & Date
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedJustification.courseCode} ({selectedJustification.absenceDate})
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold text-right">
                  Status
                </span>
                <span className="font-bold text-xs uppercase text-right block">
                  {selectedJustification.status}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Reason Provided
              </p>
              <p className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-700">
                {selectedJustification.reason}
              </p>
            </div>

            {selectedJustification.comment && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Comments
                </p>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700">
                  {selectedJustification.comment}
                </p>
              </div>
            )}

            {/* Rejection Note if rejected */}
            {selectedJustification.status === "REJECTED" && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
                <p className="text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <XCircle size={14} /> Rejection Reason from Reviewer
                </p>
                <p className="text-xs text-red-700 dark:text-red-200">
                  {selectedJustification.rejectionReason || "Document does not sufficiently justify the absence."}
                </p>
                {selectedJustification.reviewedByName && (
                  <p className="text-[11px] text-red-500 mt-1 italic">
                    Reviewed by {selectedJustification.reviewedByName} on {selectedJustification.reviewedAt}
                  </p>
                )}
              </div>
            )}

            {/* Attached Document Card */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Attached Document
              </p>
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {selectedJustification.documentName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {formatFileSize(selectedJustification.documentSize)} • {selectedJustification.documentType}
                    </p>
                  </div>
                </div>

                <a
                  href={selectedJustification.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <Download size={13} />
                  Download
                </a>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewDetailsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= MODAL: SUBMISSION SUCCESS CONFIRMATION ================= */}
      <Modal
        isOpen={submittedSuccessModalOpen}
        onClose={() => {
          setSubmittedSuccessModalOpen(false);
          navigate(-1);
        }}
        title="Justification Submitted"
        subtitle="Your request has been forwarded to faculty and administration"
        maxWidth="md"
      >
        <div className="text-center py-5 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Absence Justification Sent!
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              Your official supporting document and explanation have been submitted for review. Click the <strong>(X)</strong> button in the top corner or below to return to your previous page.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSubmittedSuccessModalOpen(false);
                navigate(-1);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition flex items-center justify-center gap-2 active:scale-95"
            >
              <X size={15} />
              <span>(X) Go Back to Previous Page</span>
            </button>
            <button
              type="button"
              onClick={() => setSubmittedSuccessModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition"
            >
              Stay on this page
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentAbsences;

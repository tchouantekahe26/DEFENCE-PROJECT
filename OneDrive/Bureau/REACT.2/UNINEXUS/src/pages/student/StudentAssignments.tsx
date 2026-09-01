import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import {
  FileEdit,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  User,
  ExternalLink,
  Send,
} from "lucide-react";
import type { Assignment } from "../../types";

export const StudentAssignments: React.FC = () => {
  const { user } = useAuth();
  const { assignments, submissions, submitAssignment } = useData();

  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const studentId = user?.id || "usr-student-1";
  const studentName = user?.name || "Alex Johnson";

  const getStudentSubmission = (asgId: string) => {
    return submissions.find(
      (s) => s.assignmentId === asgId && s.studentId === studentId
    );
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsg || !submissionContent.trim()) return;

    setLoading(true);
    try {
      submitAssignment({
        assignmentId: selectedAsg.id,
        studentId,
        studentName,
        content: submissionContent,
        status: "submitted",
      });
      setSubmittedNotice(true);
      setTimeout(() => {
        setSubmittedNotice(false);
        setSelectedAsg(null);
        setSubmissionContent("");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Coursework & Assignments
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review assignment specifications, submit your deliverables and check instructor feedback
        </p>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((asg) => {
          const submission = getStudentSubmission(asg.id);
          const isGraded = submission?.status === "graded";
          const isSubmitted = !!submission;
          const dueDateObj = new Date(asg.dueDate);
          const isPastDue = new Date() > dueDateObj;

          return (
            <div
              key={asg.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                    {asg.courseCode}
                  </span>
                  <Badge
                    variant={
                      isGraded
                        ? "success"
                        : isSubmitted
                        ? "info"
                        : isPastDue
                        ? "danger"
                        : "warning"
                    }
                  >
                    {isGraded
                      ? `Graded: ${submission.score}/${asg.maxScore}`
                      : isSubmitted
                      ? "Submitted"
                      : isPastDue
                      ? "Past Deadline"
                      : "Pending"}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {asg.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {asg.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <User size={13} className="text-slate-400" />
                    {asg.lecturerName}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock size={13} className="text-slate-400" />
                    Due:{" "}
                    <span className="font-semibold text-slate-800">
                      {dueDateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                </div>

                {submission?.feedback && (
                  <div className="mt-3 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-900">
                    <span className="font-bold block mb-0.5">Lecturer Feedback:</span>
                    {submission.feedback}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedAsg(asg);
                    setSubmissionContent(submission?.content || "");
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isSubmitted
                      ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                  }`}
                >
                  <FileEdit size={14} />
                  {isSubmitted ? "View / Edit Submission" : "Submit Assignment"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {selectedAsg && (
        <Modal
          isOpen={!!selectedAsg}
          onClose={() => setSelectedAsg(null)}
          title={`Submit: ${selectedAsg.title}`}
          subtitle={`${selectedAsg.courseCode} • Max Score: ${selectedAsg.maxScore} points`}
          maxWidth="xl"
        >
          {submittedNotice ? (
            <div className="text-center py-6">
              <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900">
                Assignment Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your submission timestamp has been recorded.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Instructions
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                  {selectedAsg.description}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Submission Deliverable (Repository Link / Code / Response)
                </label>
                <textarea
                  required
                  rows={6}
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Paste GitHub repository link, drive document link, or inline solution text..."
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAsg(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !submissionContent.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Send size={14} />
                  {loading ? "Submitting..." : "Submit Deliverable"}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

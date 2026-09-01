import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Badge } from "../../components/common/Badge";
import { Modal } from "../../components/common/Modal";
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Ambulance,
  Flame,
  Search,
  Filter,
} from "lucide-react";
import type { EmergencyReport } from "../../types";

export const AdminEmergency: React.FC = () => {
  const { emergencyReports, updateEmergencyStatus } = useData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const filteredReports = emergencyReports.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.emergencyType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (
    status: EmergencyReport["status"],
    notes?: string
  ) => {
    if (!selectedReport) return;
    updateEmergencyStatus(selectedReport.id, status, notes || resolutionNote);
    setSelectedReport((prev) =>
      prev ? { ...prev, status, resolutionNotes: notes || resolutionNote } : null
    );
    setResolutionNote("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Campus Emergency Dispatch Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time emergency alert triage, first responder dispatch and campus safety logs
          </p>
        </div>
      </div>

      {/* Emergency Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Urgent Reports
            </span>
            <h3 className="text-3xl font-black text-red-900 mt-1">
              {emergencyReports.filter((r) => r.status === "Reported").length}
            </h3>
          </div>
          <AlertTriangle size={24} className="text-red-600" />
        </div>

        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Dispatched
            </span>
            <h3 className="text-3xl font-black text-amber-900 mt-1">
              {emergencyReports.filter((r) => r.status === "Dispatched").length}
            </h3>
          </div>
          <ShieldAlert size={24} className="text-amber-600" />
        </div>

        <div className="bg-sky-50 border border-sky-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              In Progress
            </span>
            <h3 className="text-3xl font-black text-sky-900 mt-1">
              {emergencyReports.filter((r) => r.status === "In Progress").length}
            </h3>
          </div>
          <Clock size={24} className="text-sky-600" />
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Resolved
            </span>
            <h3 className="text-3xl font-black text-emerald-900 mt-1">
              {emergencyReports.filter((r) => r.status === "Resolved").length}
            </h3>
          </div>
          <CheckCircle2 size={24} className="text-emerald-600" />
        </div>
      </div>

      {/* Incident Log Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["all", "Reported", "Dispatched", "In Progress", "Resolved"].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                    statusFilter === st
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {st === "all" ? "All Incidents" : st}
                </button>
              )
            )}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search location, name, type..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-red-100 text-red-800 font-bold text-xs">
                    {report.emergencyType}
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    {report.location}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-1 leading-relaxed">
                  {report.description}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span>
                    Reported by: <strong>{report.userName}</strong> ({report.userRole})
                  </span>
                  <span>•</span>
                  <span>Contact: {report.userPhone}</span>
                  <span>•</span>
                  <span>{new Date(report.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <Badge
                  variant={
                    report.status === "Resolved"
                      ? "success"
                      : report.status === "Dispatched"
                      ? "warning"
                      : "danger"
                  }
                >
                  {report.status}
                </Badge>
                <button className="text-xs font-bold text-indigo-600 hover:underline">
                  Triage Incident →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Triage Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Emergency Incident: ${selectedReport.emergencyType}`}
          subtitle={`Location: ${selectedReport.location}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-red-950 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-red-700">
                Situation Details
              </p>
              <p className="text-sm font-medium">{selectedReport.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Reporter</span>
                <strong className="text-slate-800">{selectedReport.userName}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Phone Number</span>
                <strong className="text-slate-800">{selectedReport.userPhone}</strong>
              </div>
            </div>

            {selectedReport.resolutionNotes && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <span className="font-bold block mb-0.5">Current Dispatch Log:</span>
                {selectedReport.resolutionNotes}
              </div>
            )}

            {/* Quick Dispatch Status Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Update Incident Dispatch Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      "Dispatched",
                      "Campus patrol team dispatched to location."
                    )
                  }
                  className="py-2 px-3 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition"
                >
                  Mark Dispatched
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      "In Progress",
                      "First responders actively addressing incident."
                    )
                  }
                  className="py-2 px-3 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition"
                >
                  Mark In Progress
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      "Resolved",
                      "Situation inspected and verified safe."
                    )
                  }
                  className="py-2 px-3 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
                >
                  Mark Resolved
                </button>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

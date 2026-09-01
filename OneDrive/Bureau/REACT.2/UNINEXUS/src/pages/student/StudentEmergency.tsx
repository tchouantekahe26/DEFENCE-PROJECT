import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { EmergencyModal } from "../../components/common/EmergencyModal";
import { Badge } from "../../components/common/Badge";
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Ambulance,
  Flame,
  Shield,
} from "lucide-react";

export const StudentEmergency: React.FC = () => {
  const { user } = useAuth();
  const { emergencyReports } = useData();
  const [modalOpen, setModalOpen] = useState(false);

  const studentReports = emergencyReports.filter(
    (r) => r.userId === user?.id || r.userName === user?.name
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Campus Emergency Response System
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Instant SOS alert dispatch for security threats, medical emergencies, and campus safety
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: BIG SOS DISPATCH HERO (Matching UI design) */}
        <div className="bg-gradient-to-b from-blue-500 to-teal-700 rounded-4xl p-8 text-white shadow-xl flex flex-col justify-between text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white/20">
              <ShieldAlert size={44} className="text-white" />
            </div>

            <h2 className="text-2xl font-extrabold text-white">
              Emergency Report
            </h2>
            <p className="text-sm text-red-100 mt-2 max-w-xs mx-auto leading-relaxed">
              In case of urgent emergency or threat to safety, send an instant alert to campus dispatch.
            </p>

            <button
              onClick={() => setModalOpen(true)}
              className="mt-8 w-full py-4 px-6 bg-white hover:bg-red-50 text-red-700 font-extrabold text-base rounded-2xl shadow-xl shadow-red-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Send Emergency Alert
            </button>
          </div>

          {/* Emergency Contacts Card */}
          <div className="mt-8 pt-6 border-t border-white/20 text-left space-y-3 relative z-10 bg-black/10 p-5 rounded-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-white-200">
              Emergency Hotlines (24/7)
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white font-medium flex items-center gap-2">
                <Shield size={16} className="text-red-200" />
                University Security
              </span>
              <a
                href="tel:+15550100"
                className="font-bold text-white hover:underline text-base"
              >
                +237 655 435 144
              </a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white font-medium flex items-center gap-2">
                <Ambulance size={16} className="text-red-200" />
                Health Center
              </span>
              <a
                href="tel:+15550200"
                className="font-bold text-white hover:underline text-base"
              >
                +237 224 272 9957
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT 2 COLS: MY REPORTED INCIDENTS & CAMPUS PROTOCOLS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Log */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              My Incident Reports Log
            </h3>

            {studentReports.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500" />
                <p className="text-xs font-bold text-slate-700">No active incidents</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  You have not submitted any emergency alerts.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentReports.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-white-100 text-red-800 font-bold text-xs">
                          {item.emergencyType}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {item.location}
                        </span>
                      </div>
                      <Badge
                        variant={
                          item.status === "Resolved"
                            ? "success"
                            : item.status === "Dispatched"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    {item.resolutionNotes && (
                      <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">
                        Dispatch Update: {item.resolutionNotes}
                      </p>
                    )}

                    <span className="text-[10px] text-slate-400 block pt-1">
                      Reported on {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safety Protocols */}
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              Campus Emergency Guidelines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/60">
                <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Ambulance size={15} className="text-red-500" />
                  Medical Distress
                </p>
                <p>
                  Call Health Center or trigger SOS. Do not move injured person unless danger is imminent.
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/60">
                <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Flame size={15} className="text-amber-500" />
                  Fire or Hazard
                </p>
                <p>
                  Evacuate through marked emergency stairwells. Assemble at North Campus sports field.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmergencyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

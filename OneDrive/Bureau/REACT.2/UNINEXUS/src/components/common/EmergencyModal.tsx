import React, { useState } from "react";
import { Modal } from "./Modal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, role } = useAuth();
  const { reportEmergency } = useData();

  const [location, setLocation] = useState("");
  const [emergencyType, setEmergencyType] = useState<
    "Medical" | "Security" | "Fire" | "Harassment" | "Other"
  >("Security");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) return;

    setLoading(true);
    try {
      await reportEmergency({
        userId: user?.id || "usr-anon",
        userName: user?.name || "Campus User",
        userRole: role,
        userPhone: user?.phone || "+1 555-0100",
        location,
        emergencyType,
        description,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setLocation("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="🚨 University Emergency Dispatch"
      subtitle="Immediate response assistance for campus emergencies"
      maxWidth="md"
    >
      {submitted ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Emergency Alert Dispatched!
          </h3>
          <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
            Campus Security & First Responders have been notified of your location
            ({location}) and are en route.
          </p>

          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Direct Emergency Contacts
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Campus Security:</span>
                <a
                  href="tel:+15550100"
                  className="text-red-600 font-bold hover:underline"
                >
                  +1 555-0100
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Health Center:</span>
                <a
                  href="tel:+15550200"
                  className="text-indigo-600 font-bold hover:underline"
                >
                  +1 555-0200
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="mt-6 w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition"
          >
            Close Window
          </button>
        </div>
      ) : (
        <div>
          {/* Emergency contacts banner */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-start gap-3">
            <ShieldAlert size={22} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-800 uppercase tracking-wide">
                Life-Threatening Emergency?
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                Call Security directly at{" "}
                <strong className="underline">+1 555-0100</strong> or Health
                Center at <strong>+1 555-0200</strong>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Emergency Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  ["Medical", "Security", "Fire", "Harassment", "Other"] as const
                ).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEmergencyType(type)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      emergencyType === type
                        ? "bg-red-600 border-red-600 text-white shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Exact Location on Campus
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Science Block Room 204 / Library 2nd Floor"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Situation Description
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what happened and if anyone is hurt..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <AlertTriangle size={18} />
                {loading ? "Transmitting Alert..." : "Broadcast Emergency Alert"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};

import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200/80 space-y-6">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <GraduationCap size={36} />
        </div>

        <div>
          <span className="text-5xl font-black text-indigo-600 block tracking-tight">
            404
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-2">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            The university portal route you requested does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

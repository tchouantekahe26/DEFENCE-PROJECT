import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import type { UserRole } from "../../types";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@uninexus.edu");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("registered") === "true") {
      setRegisteredSuccess(true);
    }
  }, [location]);

  const handleRoleQuickFill = (role: UserRole) => {
    if (role === "student") {
      setEmail("adesimon0@gmail.com");
      setPassword("password");
    } else if (role === "teacher") {
      setEmail("tchoutouo@uninexus.edu");
      setPassword("password");
    } else if (role === "admin") {
      setEmail("admin@uninexus.edu");
      setPassword("password");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email.trim(), password);

      if (result.user.role === "student") {
        navigate("/student/dashboard");
      } else if (result.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (result.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 items-center justify-center">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200 dark:border-slate-800">
        
        {/* ================= LEFT BRANDING ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-900/40 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <GraduationCap size={24} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight block">UNISPHERE</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 block">
                Connect · Manage · Succeed
              </span>
            </div>
          </div>

          {/* Center Graphic & Heading */}
          <div className="relative z-10 my-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Welcome Back!
            </h2>
            <p className="text-indigo-100 text-sm mb-6">
              Sign in to continue to your academic journey
            </p>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2.5">
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Select Quick Demo Credentials
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleQuickFill("student")}
                  className="py-2 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold text-center transition"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleQuickFill("teacher")}
                  className="py-2 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold text-center transition"
                >
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleQuickFill("admin")}
                  className="py-2 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold text-center transition"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-indigo-200">
            <span>Secure • Reliable • Intelligent</span>
            <span>v2.4</span>
          </div>
        </div>

        {/* ================= RIGHT SIGN IN CARD ================= */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between relative">
          <div className="max-w-md mx-auto w-full my-auto py-6">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Sign In
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Access your UNISPHERE account
              </p>
            </div>

            {/* Registration Success Banner */}
            {registeredSuccess && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Account created successfully! Please sign in with your credentials.</span>
              </div>
            )}

            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a href="#forgot" className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Signing in..." : "Sign In"}
                <ArrowRight size={16} />
              </button>

              <div className="text-center pt-3 text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                  Sign up
                </Link>
              </div>
            </form>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Protected by enterprise-grade encryption & RBAC security
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

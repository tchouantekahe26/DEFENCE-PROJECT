import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  Shield,
  Sparkles,
  Check,
  X,
  Mail,
  Lock,
  User,
  Building2,
  CheckCircle2,
} from "lucide-react";
import type { UserRole } from "../../types";
import { PolicyModal } from "../../components/common/PolicyModal";

const LEVEL_CLASSES_MAP: Record<string, string[]> = {
  "Level 1": ["BA1A", "BA1B"],
  "Level 2": ["BA2A", "BA2B"],
  "Level 3": ["BA3A", "BA3B"],
};

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { isDark } = useTheme();

  const [role, setRole] = useState<UserRole>("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [level, setLevel] = useState("Level 1");
  const [className, setClassName] = useState("BA1A");
  const [department, setDepartment] = useState("Computer Science");

  const availableClasses = LEVEL_CLASSES_MAP[level] || ["BA1A", "BA1B"];

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    const classes = LEVEL_CLASSES_MAP[newLevel] || [];
    if (classes.length > 0) {
      setClassName(classes[0]);
    }
  };
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<"terms" | "privacy">("terms");

  // Password validation rules
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!hasMinLength || !hasNumber || !hasUppercase) {
      setError("Please ensure password satisfies security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
        role: "student",
        identifier: identifier.trim() || `STU-${Math.floor(Math.random() * 9000 + 1000)}`,
        department: department.trim() || "Computer Science",
        level: level.trim() || "Level 2",
        className: className.trim() || "BA1A",
      });

      // Crucial requirement #16: Redirect to LOGIN page (do not automatically log in)
      navigate("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 items-center justify-center">
      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200 dark:border-slate-800">
        
        {/* ================= LEFT SIDE: HERO BRANDING ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#3730a3] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background circles */}
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

          {/* Center Illustration & Heading */}
          <div className="relative z-10 my-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Create Account
            </h2>
            <p className="text-indigo-100 text-sm mb-6">
              Join UNISPHERE and get started on your academic journey
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold">For Students, Teachers and Administrators</p>
                  <p className="text-[11px] text-indigo-200">Personalized portal for every role</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold">Secure & Protected</p>
                  <p className="text-[11px] text-indigo-200">Your institutional data is safe with us</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold">Intelligent Features</p>
                  <p className="text-[11px] text-indigo-200">AI-powered absence & academic support</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-1.5 text-xs text-indigo-200">
            <div>© 2026 UNISPHERE Platform. All rights reserved.</div>
            <div className="flex items-center gap-2 text-[11px] text-indigo-200/80">
              <button
                type="button"
                onClick={() => {
                  setPolicyModalTab("terms");
                  setPolicyModalOpen(true);
                }}
                className="hover:text-white underline cursor-pointer transition"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setPolicyModalTab("privacy");
                  setPolicyModalOpen(true);
                }}
                className="hover:text-white underline cursor-pointer transition"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: REGISTRATION FORM ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 overflow-y-auto max-h-[90vh]">
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Create Account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fill in your details to get started
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration Portal Notice */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <GraduationCap size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                    Student Registration Portal
                  </h4>
                  <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5 leading-relaxed">
                    Self-service registration is strictly for students. Faculty, Lecturer, and Staff accounts are managed and provisioned directly by the System Administrator.
                  </p>
                </div>
              </div>

              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your university email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"
                />
              </div>

              {/* Department & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Networks & Systems">Networks & Systems</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => handleLevelChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="Level 1">Level 1 (HND 1)</option>
                    <option value="Level 2">Level 2 (HND 2)</option>
                    <option value="Level 3">Level 3 (Bachelor)</option>
                  </select>
                </div>
              </div>

              {/* Student Matric ID & Class Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Matric ID
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. CS2026001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class / Group <span className="text-indigo-600 dark:text-indigo-400 font-bold">*</span>
                  </label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 cursor-pointer font-medium"
                  >
                    {availableClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirement Badges */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
                  {hasMinLength ? <Check size={13} /> : <div className="w-3 h-3 rounded-full border border-slate-400" />}
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
                  {hasNumber ? <Check size={13} /> : <div className="w-3 h-3 rounded-full border border-slate-400" />}
                  <span>One number</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
                  {hasUppercase ? <Check size={13} /> : <div className="w-3 h-3 rounded-full border border-slate-400" />}
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
                  {hasSpecial ? <Check size={13} /> : <div className="w-3 h-3 rounded-full border border-slate-400" />}
                  <span>One special character</span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer leading-relaxed">
                  I have read and agree to the{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPolicyModalTab("terms");
                      setPolicyModalOpen(true);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-bold underline hover:text-indigo-800 dark:hover:text-indigo-300 transition cursor-pointer"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPolicyModalTab("privacy");
                      setPolicyModalOpen(true);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-bold underline hover:text-indigo-800 dark:hover:text-indigo-300 transition cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition text-sm disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* Policy Modal with Terms of Service & Privacy Policy */}
      <PolicyModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        initialTab={policyModalTab}
        isAgreed={agreed}
        onAccept={() => setAgreed(true)}
      />
    </div>
  );
};

export default Register;

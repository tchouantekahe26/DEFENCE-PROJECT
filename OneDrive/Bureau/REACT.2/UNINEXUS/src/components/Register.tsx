import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  User,
  GraduationCap,
  BriefcaseBusiness,
  IdCard,
  Building2,
  ArrowRight,
} from "lucide-react";
import { apiService } from "../services/api";
import { PolicyModal } from "./common/PolicyModal";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<"terms" | "privacy">("terms");

  const [formData, setFormData] = useState({
    fullName: "",
    id: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    level: "",
    className: "BA1A",
    courses: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    // ID validation
    if (!formData.id.trim()) {
      newErrors.id = `${role === "student" ? "Student" : "Staff"} ID is required`;
    } else if (formData.id.trim().length < 3) {
      newErrors.id = "ID must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    // Level validation for students
    if (role === "student" && !formData.level) {
      newErrors.level = "Please select your level";
    }

    // Courses validation for teachers
    if (role === "teacher" && !formData.courses.trim()) {
      newErrors.courses = "Courses/Subjects taught is required";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms and privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrors({});

    apiService
      .register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        id: formData.id,
      })
      .then((response) => {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        setErrors({
          submit: error.message || "Registration failed. Please try again.",
        });
        console.error("Registration error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex items-center justify-center">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}
        <div className="hidden lg:flex relative bg-indigo-700 text-white p-12 flex-col justify-between overflow-hidden">

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500 rounded-full opacity-40" />

          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-indigo-900 rounded-full opacity-40" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
                <GraduationCap size={26} />
              </div>

              <span className="text-2xl font-bold">
                UniNexus
              </span>
            </div>

            <div className="mt-24 max-w-md">

              <p className="text-indigo-200 text-sm font-medium mb-3">
                JOIN THE UNIVERSITY COMMUNITY
              </p>

              <h1 className="text-4xl font-bold leading-tight">
                Your academic journey starts here.
              </h1>

              <p className="mt-6 text-indigo-100 leading-relaxed">
                Create your UniNexus account and access academic
                information, university services and intelligent
                student support from one platform.
              </p>

            </div>
          </div>

          <div className="relative z-10 text-sm text-indigo-200">
            © 2026 UniNexus
          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="p-8 sm:p-10 lg:p-12">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">

            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
              <GraduationCap size={23} />
            </div>

            <span className="text-xl font-bold text-slate-900">
              UniNexus
            </span>

          </div>

          <div className="max-w-lg mx-auto">

            <div className="mb-7">

              <h2 className="text-3xl font-bold text-slate-900">
                Create your account
              </h2>

              <p className="text-slate-500 mt-2">
                Join the UniNexus university community.
              </p>

            </div>

            {/* ================= ROLE NOTICE ================= */}
            <div className="mb-7 p-4 rounded-xl border border-indigo-200 bg-indigo-50/70 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  Student Registration Portal
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Self-registration is available for students. Faculty and staff accounts are provisioned exclusively by the System Administrator.
                </p>
              </div>
            </div>

            {/* ================= FORM ================= */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl
                    outline-none focus:ring-4 transition ${
                      errors.fullName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />

                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* ID */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">

                  {role === "student"
                    ? "Student ID"
                    : "Staff ID"}

                </label>

                <div className="relative">

                  <IdCard
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    required
                    placeholder={
                      role === "student"
                        ? "Enter your student ID"
                        : "Enter your staff ID"
                    }
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl
                    outline-none focus:ring-4 transition ${
                      errors.id
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />

                </div>
                {errors.id && (
                  <p className="text-red-500 text-sm mt-1">{errors.id}</p>
                )}

              </div>

              {/* Email */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl
                    outline-none focus:ring-4 transition ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />

                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}

              </div>

              {/* Department */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>

                <div className="relative">

                  <Building2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    placeholder="Enter your department"
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl
                    outline-none focus:ring-4 transition ${
                      errors.department
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />

                </div>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                )}

              </div>

              {/* Student-specific */}
              {role === "student" && (

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Level
                  </label>

                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3.5 border rounded-xl
                    outline-none focus:ring-4 transition bg-white ${
                      errors.level
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  >

                    <option value="">
                      Select your level
                    </option>

                    <option value="HND1">
                      HND 1
                    </option>

                    <option value="HND2">
                      HND 2
                    </option>

                  </select>
                  {errors.level && (
                    <p className="text-red-500 text-sm mt-1">{errors.level}</p>
                  )}

                </div>

              )}

              {/* Teacher-specific */}
              {role === "teacher" && (

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Courses / Subjects Taught
                  </label>

                  <input
                    name="courses"
                    value={formData.courses}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Database, Networking"
                    className={`w-full px-4 py-3.5 border rounded-xl
                    outline-none focus:ring-4 transition ${
                      errors.courses
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />
                  {errors.courses && (
                    <p className="text-red-500 text-sm mt-1">{errors.courses}</p>
                  )}

                </div>

              )}

              {/* Password */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    className={`w-full pl-11 pr-12 py-3.5 border rounded-xl
                    outline-none focus:ring-4 transition ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}

              </div>

              {/* Confirm Password */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className={`w-full pl-11 pr-12 py-3.5 border rounded-xl
                    outline-none focus:ring-4 transition ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}

              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-2">

                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 accent-indigo-600"
                />

                <label className={`text-sm ${errors.terms ? "text-red-500" : "text-slate-500 dark:text-slate-400"}`}>
                  I agree to the UNISPHERE{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setPolicyModalTab("terms");
                      setPolicyModalOpen(true);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold underline hover:text-indigo-800 dark:hover:text-indigo-300 transition cursor-pointer"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setPolicyModalTab("privacy");
                      setPolicyModalOpen(true);
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold underline hover:text-indigo-800 dark:hover:text-indigo-300 transition cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  .
                </label>

              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700
                text-white font-semibold py-3.5 rounded-xl
                transition flex items-center justify-center gap-2
                shadow-lg shadow-indigo-200"
              >

                Create{" "}
                {role === "student"
                  ? "Student"
                  : "Teacher"}{" "}
                Account

                <ArrowRight size={18} />

              </button>

            </form>

            {/* Login */}
            <div className="text-center mt-7 text-sm text-slate-500">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </Link>

            </div>

          </div>

        </div>

      </div>

      <PolicyModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        initialTab={policyModalTab}
        isAgreed={formData.terms}
        onAccept={() => setFormData((prev) => ({ ...prev, terms: true }))}
      />

    </div>
  );
};

export default Register;
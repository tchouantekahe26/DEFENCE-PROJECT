
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { apiService } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    emailOrId: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email or ID validation
    if (!formData.emailOrId.trim()) {
      newErrors.emailOrId = "Email or Student ID is required";
    } else if (formData.emailOrId.trim().length < 3) {
      newErrors.emailOrId = "Email or ID must be at least 3 characters";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$|^[A-Za-z0-9]{3,}$/.test(formData.emailOrId)) {
      newErrors.emailOrId = "Please enter a valid email or ID";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
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

    // Connect this later to your backend
    console.log({
      ...formData,
      rememberMe,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}
        <div className="hidden lg:flex relative bg-indigo-700 text-white p-12 flex-col justify-between overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500 rounded-full opacity-40" />
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-indigo-900 rounded-full opacity-40" />

          <div className="relative z-10">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
                <GraduationCap size={26} />
              </div>

              <span className="text-2xl font-bold">
                UniNexus
              </span>
            </div>

            {/* Main text */}
            <div className="mt-28 max-w-md">
              <p className="text-indigo-200 text-sm font-medium mb-3">
                INTELLIGENT UNIVERSITY MANAGEMENT
              </p>

              <h1 className="text-4xl font-bold leading-tight">
                One platform for your academic journey.
              </h1>

              <p className="mt-6 text-indigo-100 leading-relaxed">
                Manage your academic information, stay informed about
                university activities, communicate with your community
                and access intelligent academic support.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-sm text-indigo-200">
            © 2026 UniNexus
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="p-8 sm:p-12 lg:p-16">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
              <GraduationCap size={23} />
            </div>

            <span className="text-xl font-bold text-slate-900">
              UniNexus
            </span>
          </div>

          <div className="max-w-md mx-auto">

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="text-slate-500 mt-2">
                Sign in to continue to UniNexus.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email or Student ID
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="emailOrId"
                    value={formData.emailOrId}
                    onChange={handleChange}
                    placeholder="Enter your email or ID"
                    required
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl
                    outline-none transition focus:ring-4 ${
                      errors.emailOrId
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }
                    placeholder:text-slate-400`}
                  />
                </div>
                {errors.emailOrId && (
                  <p className="text-red-500 text-sm mt-1">{errors.emailOrId}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className={`w-full pl-11 pr-12 py-3.5 border rounded-xl
                    outline-none transition focus:ring-4 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                    }
                    placeholder:text-slate-400`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />

                <label className="text-sm text-slate-600">
                  Remember me
                </label>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700
                text-white font-semibold py-3.5 rounded-xl
                transition flex items-center justify-center gap-2
                shadow-lg shadow-indigo-200"
              >
                Sign In
                <ArrowRight size={18} />
              </button>

            </form>

            {/* Register */}
            <div className="text-center mt-8 text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create an account
              </Link>
            </div>

            <p className="text-center text-xs text-slate-400 mt-10">
              By continuing, you agree to UniNexus's terms and privacy policy.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
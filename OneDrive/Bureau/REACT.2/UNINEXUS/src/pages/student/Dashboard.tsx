import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, BookOpen, BarChart3, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 text-sm">Welcome, {user?.name}!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Student Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Student ID</p>
              <p className="text-2xl font-bold text-purple-600">{user?.identifier}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Email</p>
              <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Department</p>
              <p className="text-lg font-semibold text-gray-900">{user?.department}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Level</p>
              <p className="text-lg font-semibold text-gray-900">{user?.level}</p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Courses</h3>
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-gray-600 text-sm">View enrolled courses</p>
            <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition">
              View Courses
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Results</h3>
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-gray-600 text-sm">Check your grades and marks</p>
            <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
              View Results
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Timetable</h3>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm">View class schedule</p>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
              View Timetable
            </button>
          </div>
        </div>

        {/* Status Alert */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-2">Account Status</h3>
          <p className="text-green-700">
            Your account is <span className="font-bold">active</span> and fully functional. You have access to all student resources.
          </p>
        </div>
      </main>
    </div>
  );
};

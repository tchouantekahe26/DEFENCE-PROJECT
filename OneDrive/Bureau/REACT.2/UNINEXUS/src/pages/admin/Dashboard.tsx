import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Users, Settings, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/users/get-all-users", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const studentCount = users.filter(u => u.role === "student").length;
  const teacherCount = users.filter(u => u.role === "teacher").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm">System Administration & Management</p>
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
        {/* Admin Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Administrator Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-600 text-sm font-medium">Admin ID</p>
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
              <p className="text-gray-600 text-sm font-medium">Role</p>
              <p className="text-lg font-bold text-red-600">ADMIN</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Total Users</h3>
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-4xl font-bold text-purple-600">{users.length}</p>
            <p className="text-gray-600 text-sm mt-2">Registered on platform</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Students</h3>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-blue-600">{studentCount}</p>
            <p className="text-gray-600 text-sm mt-2">Active student accounts</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Teachers</h3>
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-600">{teacherCount}</p>
            <p className="text-gray-600 text-sm mt-2">Active teacher accounts</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Registered Users</h2>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Department</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{u.name}</td>
                      <td className="py-3 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === "student"
                              ? "bg-blue-100 text-blue-700"
                              : u.role === "teacher"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{u.identifier}</td>
                      <td className="py-3 px-4 text-gray-600">{u.department}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Security Alert */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-2">Security Notice</h3>
          <p className="text-yellow-700">
            As an administrator, you have full access to all system resources. Ensure all credentials remain confidential and secure.
          </p>
        </div>
      </main>
    </div>
  );
};

import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Badge } from "../../components/common/Badge";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  UserX,
  UserCheck,
  Filter,
} from "lucide-react";
import type { User, UserRole } from "../../types";

export const AdminUsers: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useData();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [identifier, setIdentifier] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [level, setLevel] = useState("HND 2");
  const [phone, setPhone] = useState("");

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setRole("student");
    setIdentifier(`CS202500${users.length + 1}`);
    setDepartment("Computer Science");
    setLevel("HND 2");
    setPhone("+1 555-0123");
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setIdentifier(user.identifier);
    setDepartment(user.department);
    setLevel(user.level || "HND 2");
    setPhone(user.phone || "");
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !identifier.trim()) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        name,
        email,
        role,
        identifier,
        department,
        level,
        phone,
      });
    } else {
      addUser({
        name,
        email,
        role,
        identifier,
        department,
        level,
        phone,
        status: "active",
        avatar:
          role === "admin"
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            : role === "teacher"
            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      });
    }

    setModalOpen(false);
  };

  const handleToggleStatus = (u: User) => {
    updateUser(u.id, {
      status: u.status === "active" ? "inactive" : "active",
    });
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.identifier.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q);

    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            User Management Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage students, faculty lecturers and administrator accounts
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          Create New User
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Role Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Roles" },
            { key: "student", label: "Students" },
            { key: "teacher", label: "Faculty / Teachers" },
            { key: "admin", label: "Administrators" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                roleFilter === tab.key
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">User</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">ID / Matric</th>
                <th className="pb-3">Department</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 font-bold text-slate-900 flex items-center gap-3">
                    <img
                      src={
                        u.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={u.name}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <p>{u.name}</p>
                      <p className="text-[11px] text-slate-400 font-normal">
                        {u.email}
                      </p>
                    </div>
                  </td>

                  <td className="py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                        u.role === "admin"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : u.role === "teacher"
                          ? "bg-sky-50 text-sky-700 border border-sky-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-4 font-mono font-bold text-xs text-slate-700">
                    {u.identifier}
                  </td>

                  <td className="py-4 text-xs text-slate-600">
                    {u.department}
                  </td>

                  <td className="py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border transition ${
                        u.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-700"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {u.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                        title="Edit User"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setUserToDelete(u)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                        title="Delete User"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? "Edit User Account" : "Create New User"}
        subtitle="Manage role-based authentication and academic assignments"
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@uninexus.edu"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher / Faculty</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                ID / Matriculation Number
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. CS2025009"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Level (for students)
              </label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
            >
              {editingUser ? "Save User Changes" : "Create Account"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        message={`Are you sure you want to delete ${userToDelete?.name} (${userToDelete?.identifier})? All linked enrollments and permissions will be removed.`}
        confirmLabel="Delete User"
        isDestructive
      />
    </div>
  );
};

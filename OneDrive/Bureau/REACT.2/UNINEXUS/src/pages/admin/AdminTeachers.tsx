import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { Badge } from "../../components/common/Badge";
import {
  GraduationCap,
  Search,
  BookOpen,
  Phone,
  Mail,
  Building2,
  Plus,
} from "lucide-react";
import type { User } from "../../types";

export const AdminTeachers: React.FC = () => {
  const { users, courses } = useData();

  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);

  const teachers = users.filter((u) => u.role === "teacher");

  const filteredTeachers = teachers.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.identifier.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Faculty & Lecturer Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage academic staff, course allocations, departmental appointments and workload
          </p>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900">
            Faculty Members ({teachers.length})
          </h2>

          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search faculty name, ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Faculty Name</th>
                <th className="pb-3">Staff ID</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3 text-center">Assigned Courses</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((tch) => {
                const assignedCount = courses.filter((c) =>
                  c.lecturerName.includes(tch.name.split(" ")[1] || tch.name)
                ).length;

                return (
                  <tr key={tch.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={
                          tch.avatar ||
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                        }
                        alt={tch.name}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p>{tch.name}</p>
                        <p className="text-[11px] text-slate-400 font-normal">
                          {tch.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 font-mono font-bold text-sky-700 text-xs">
                      {tch.identifier}
                    </td>
                    <td className="py-4 text-xs text-slate-600">
                      {tch.department}
                    </td>
                    <td className="py-4 text-xs text-slate-600">
                      {tch.phone || "+1 555-0145"}
                    </td>
                    <td className="py-4 text-center">
                      <span className="font-bold text-xs px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                        {assignedCount || 3} Courses
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setSelectedTeacher(tch)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200 transition"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Profile Modal */}
      {selectedTeacher && (
        <Modal
          isOpen={!!selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          title={`Faculty Profile: ${selectedTeacher.name}`}
          subtitle={`Staff ID: ${selectedTeacher.identifier} • Department: ${selectedTeacher.department}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="text-center pb-4 border-b border-slate-100">
              <img
                src={selectedTeacher.avatar}
                alt={selectedTeacher.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto mb-2 ring-2 ring-sky-200 shadow-sm"
              />
              <h3 className="text-base font-bold text-slate-900">
                {selectedTeacher.name}
              </h3>
              <p className="text-slate-500">{selectedTeacher.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Department</span>
                <span className="font-bold text-slate-800">{selectedTeacher.department}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Office Location</span>
                <span className="font-bold text-slate-800">Faculty Block B, Room 304</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Office Hours</span>
                <span className="font-bold text-slate-800">Mon & Wed 14:00 - 16:00</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

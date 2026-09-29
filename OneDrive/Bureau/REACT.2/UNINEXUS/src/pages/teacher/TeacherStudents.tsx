import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import {
  Users,
  Search,
  Mail,
  Phone,
  GraduationCap,
  CalendarCheck,
  Award,
} from "lucide-react";
import type { User } from "../../types";

export const TeacherStudents: React.FC = () => {
  const { users, marks, attendanceRecords } = useData();

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const studentList = users.filter((u) => u.role === "student");

  const getStudentAttendance = (studentId: string) => {
    const stuRecords = attendanceRecords.filter((r) => r.studentId === studentId);
    const stuTotal = stuRecords.length;
    if (stuTotal === 0) return { label: "No records", percentage: null };
    const stuAttended = stuRecords.filter((r) =>
      ["present", "late", "excused"].includes(r.status.toLowerCase())
    ).length;
    const rate = Math.round((stuAttended / stuTotal) * 100);
    return { label: `${rate}%`, percentage: rate };
  };

  const filteredStudents = studentList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.identifier.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Enrolled Student Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse student profiles, matriculation numbers, department enrollments and progress
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name or ID..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-sky-500 transition"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Matric ID</th>
                <th className="pb-3">Program</th>
                <th className="pb-3">Level</th>
                <th className="pb-3 text-center">Attendance</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 font-bold text-slate-900 flex items-center gap-3">
                    <img
                      src={
                        stu.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={stu.name}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p>{stu.name}</p>
                        {stu.hideInfo && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200 font-semibold" title="Student set profile information to private">
                            🔒 Private
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-normal">
                        {stu.hideInfo ? "•••••••••••• (Private)" : stu.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 font-mono font-bold text-sky-700 text-xs">
                    {stu.identifier}
                  </td>
                  <td className="py-4 text-xs text-slate-600">
                    {stu.program || "Computer Science"}
                  </td>
                  <td className="py-4 text-xs font-semibold text-slate-700">
                    {stu.level || "HND 2"}
                  </td>
                  <td className="py-4 text-center">
                    {(() => {
                      const att = getStudentAttendance(stu.id);
                      if (att.percentage === null) {
                        return (
                          <span className="font-semibold text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                            No records
                          </span>
                        );
                      }
                      const isGood = att.percentage >= 75;
                      return (
                        <span
                          className={`font-bold text-xs px-2.5 py-1 rounded-full border ${
                            isGood
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {att.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => setSelectedStudent(stu)}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200 transition"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Profile: ${selectedStudent.name}`}
          subtitle={`ID: ${selectedStudent.identifier} • ${selectedStudent.department}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="text-center pb-4 border-b border-slate-100">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto mb-2 ring-2 ring-sky-200 shadow-sm"
              />
              <h3 className="text-base font-bold text-slate-900">
                {selectedStudent.name}
              </h3>
              <p className="text-slate-500">
                {selectedStudent.hideInfo ? "•••••••••••• (Hidden by student)" : selectedStudent.email}
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Program</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.program || "B.Sc. Computer Science"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Level</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.level || "HND 2"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium">Phone</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.hideInfo ? "•••••••••••• (Private)" : (selectedStudent.phone || "Not provided")}
                </span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
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

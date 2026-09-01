import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Users,
} from "lucide-react";
import type { Department, Faculty, Program } from "../../types";

export const AdminDepartments: React.FC = () => {
  const {
    departments,
    faculties,
    programs,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [faculty, setFaculty] = useState("School of Computing");
  const [headOfDepartment, setHeadOfDepartment] = useState("");

  const handleOpenAdd = () => {
    setEditingDept(null);
    setName("");
    setCode("");
    setFaculty("School of Computing");
    setHeadOfDepartment("Dr. New Head");
    setModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setCode(dept.code);
    setFaculty(dept.faculty);
    setHeadOfDepartment(dept.headOfDepartment);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (editingDept) {
      updateDepartment(editingDept.id, {
        name,
        code,
        faculty,
        headOfDepartment,
      });
    } else {
      addDepartment({
        name,
        code,
        faculty,
        headOfDepartment,
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Faculties, Departments & Programs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize academic hierarchy: Faculty → Department → Degree Program
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Department
        </button>
      </div>

      {/* Faculties Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {faculties.map((fac) => (
          <div
            key={fac.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-800">
                {fac.code}
              </span>
              <span className="text-xs text-slate-400">
                {fac.departmentsCount} Departments
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{fac.name}</h3>
            <p className="text-xs text-slate-500">Dean: {fac.dean}</p>
          </div>
        ))}
      </div>

      {/* Departments Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">
          Academic Departments ({departments.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="p-6 rounded-3xl border border-slate-200/80 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
                    {dept.code}
                  </span>
                  <span className="text-xs text-slate-400">{dept.faculty}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Department of {dept.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Head of Department: <strong>{dept.headOfDepartment}</strong>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Students</span>
                    <strong className="text-slate-800">{dept.totalStudents || 420}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Faculty</span>
                    <strong className="text-slate-800">{dept.totalTeachers || 18}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Courses</span>
                    <strong className="text-slate-800">{dept.totalCourses || 32}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(dept)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                  title="Edit Department"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setDeptToDelete(dept)}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                  title="Delete Department"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Degree Programs Offered
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {programs.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60"
            >
              <span className="text-xs font-bold text-indigo-700">{p.code}</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{p.name}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {p.durationYears} Years Program • {p.department}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.levels.map((lvl, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                  >
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDept ? "Edit Department" : "Add New Department"}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Department Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cyber Security"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CYB"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Parent Faculty
              </label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {faculties.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Head of Department (HOD)
            </label>
            <input
              type="text"
              required
              value={headOfDepartment}
              onChange={(e) => setHeadOfDepartment(e.target.value)}
              placeholder="e.g. Dr. Alan Turing"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deptToDelete}
        onClose={() => setDeptToDelete(null)}
        onConfirm={() => {
          if (deptToDelete) {
            deleteDepartment(deptToDelete.id);
            setDeptToDelete(null);
          }
        }}
        title="Delete Department"
        message={`Are you sure you want to delete ${deptToDelete?.name}?`}
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
};

import React from "react";
import { useData } from "../../context/DataContext";
import { StatCard } from "../../components/common/StatCard";
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Award,
  CalendarCheck,
  Building2,
} from "lucide-react";

export const AdminReports: React.FC = () => {
  const { departments, courses, marks } = useData();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Institutional Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Comprehensive executive summaries on enrollment, faculty allocation and academic results
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs shadow-2xs hover:bg-slate-50 transition self-start sm:self-auto"
        >
          <Download size={15} />
          Export PDF Report
        </button>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Active Students"
          value="1,248"
          icon={Users}
          color="indigo"
          trend={{ value: "8.4%", isPositive: true }}
        />
        <StatCard
          title="Overall Attendance"
          value="91.2%"
          icon={CalendarCheck}
          color="emerald"
          badge="High Retention"
        />
        <StatCard
          title="University Avg GPA"
          value="3.38"
          icon={Award}
          color="sky"
          subtitle="Out of 4.0 scale"
        />
        <StatCard
          title="Curriculum Modules"
          value={courses.length}
          icon={Building2}
          color="purple"
          subtitle="4 Faculties"
        />
      </div>

      {/* Department-by-Department Academic Performance Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">
          Departmental Enrollment & Academic Metric Summary
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Department Name</th>
                <th className="pb-3">Faculty</th>
                <th className="pb-3 text-center">Students</th>
                <th className="pb-3 text-center">Faculty Count</th>
                <th className="pb-3 text-center">Courses Offered</th>
                <th className="pb-3 text-right">Passing Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50 transition">
                  <td className="py-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {dept.name}
                  </td>
                  <td className="py-4 text-xs text-slate-600">{dept.faculty}</td>
                  <td className="py-4 text-center font-bold text-slate-800">
                    {dept.totalStudents}
                  </td>
                  <td className="py-4 text-center font-semibold text-slate-600">
                    {dept.totalTeachers}
                  </td>
                  <td className="py-4 text-center font-semibold text-slate-600">
                    {dept.totalCourses}
                  </td>
                  <td className="py-4 text-right font-black text-emerald-700">
                    96.4%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Unauthorized } from "./pages/Unauthorized";
import { NotFound } from "./pages/NotFound";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminTimetable } from "./pages/admin/AdminTimetable";
import { AdminResults } from "./pages/admin/AdminResults";
import { AdminJustifications } from "./pages/admin/AdminJustifications";
import { AdminAnnouncements } from "./pages/admin/AdminAnnouncements";
import { AdminEmergency } from "./pages/admin/AdminEmergency";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminStudents } from "./pages/admin/AdminStudents";
import { AdminTeachers } from "./pages/admin/AdminTeachers";

// Teacher Pages
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { TeacherAttendance } from "./pages/teacher/TeacherAttendance";
import { TeacherJustifications } from "./pages/teacher/TeacherJustifications";
import { TeacherMarks } from "./pages/teacher/TeacherMarks";
import { TeacherStudents } from "./pages/teacher/TeacherStudents";
import { TeacherAnnouncements } from "./pages/teacher/TeacherAnnouncements";
import { TeacherSettings } from "./pages/teacher/TeacherSettings";

// Student Pages
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { StudentTimetable } from "./pages/student/StudentTimetable";
import { StudentAbsences } from "./pages/student/StudentAbsences";
import { StudentResults } from "./pages/student/StudentResults";
import { StudentAnnouncements } from "./pages/student/StudentAnnouncements";
import { StudentChat } from "./pages/student/StudentChat";
import { StudentEmergency } from "./pages/student/StudentEmergency";
import { StudentSettings } from "./pages/student/StudentSettings";

const RootRedirect: React.FC = () => {
  const { role } = useAuth();
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "teacher") return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Admin Routes with AppLayout */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="timetable" element={<AdminTimetable />} />
                        <Route path="results" element={<AdminResults />} />
                        <Route path="absences" element={<AdminJustifications />} />
                        <Route path="announcements" element={<AdminAnnouncements />} />
                        <Route path="emergency" element={<AdminEmergency />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="students" element={<AdminStudents />} />
                        <Route path="teachers" element={<AdminTeachers />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Teacher Routes with AppLayout */}
              <Route
                path="/teacher/*"
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <AppLayout>
                      <Routes>
                        <Route path="dashboard" element={<TeacherDashboard />} />
                        <Route path="attendance" element={<TeacherAttendance />} />
                        <Route path="absences" element={<TeacherJustifications />} />
                        <Route path="marks" element={<TeacherMarks />} />
                        <Route path="students" element={<TeacherStudents />} />
                        <Route path="announcements" element={<TeacherAnnouncements />} />
                        <Route path="settings" element={<TeacherSettings />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Student Routes with AppLayout */}
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute requiredRole="student">
                    <AppLayout>
                      <Routes>
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="timetable" element={<StudentTimetable />} />
                        <Route path="absences" element={<StudentAbsences />} />
                        <Route path="results" element={<StudentResults />} />
                        <Route path="announcements" element={<StudentAnnouncements />} />
                        <Route path="chat" element={<StudentChat />} />
                        <Route path="emergency" element={<StudentEmergency />} />
                        <Route path="settings" element={<StudentSettings />} />
                        <Route path="*" element={<Navigate to="dashboard" replace />} />
                      </Routes>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Default Root Redirect */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

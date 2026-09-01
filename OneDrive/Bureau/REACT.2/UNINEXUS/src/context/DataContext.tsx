import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  User,
  Course,
  Enrollment,
  TimetableSlot,
  AttendanceRecord,
  MarkRecord,
  Assignment,
  AssignmentSubmission,
  Announcement,
  Notification,
  EmergencyReport,
  EarlyWarningStudent,
  ChatMessage,
  Department,
  Faculty,
  Program,
  AcademicSession,
  AbsenceJustification,
} from "../types";
import {
  initialUsers,
  initialCourses,
  initialEnrollments,
  initialTimetableSlots,
  initialAttendanceRecords,
  initialJustifications,
  initialMarks,
  initialAssignments,
  initialSubmissions,
  initialAnnouncements,
  initialNotifications,
  initialEmergencyReports,
  initialEarlyWarningStudents,
  initialChatMessages,
  initialDepartments,
  initialFaculties,
  initialPrograms,
  initialAcademicSessions,
  initialAiKnowledgeBase,
} from "../data/mockDatabase";

interface DataContextType {
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  timetableSlots: TimetableSlot[];
  attendanceRecords: AttendanceRecord[];
  justifications: AbsenceJustification[];
  marks: MarkRecord[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  announcements: Announcement[];
  notifications: Notification[];
  emergencyReports: EmergencyReport[];
  earlyWarningStudents: EarlyWarningStudent[];
  chatMessages: ChatMessage[];
  departments: Department[];
  faculties: Faculty[];
  programs: Program[];
  academicSessions: AcademicSession[];

  // Absence Justification actions
  submitJustification: (data: Omit<AbsenceJustification, "id" | "status" | "submittedAt">) => Promise<AbsenceJustification>;
  approveJustification: (id: string, reviewerName: string) => Promise<void>;
  rejectJustification: (id: string, reason: string, reviewerName: string) => Promise<void>;

  // Course actions
  registerCourse: (courseId: string, studentId: string, studentName: string) => Promise<{ success: boolean; message: string }>;
  dropCourse: (courseId: string, studentId: string) => Promise<{ success: boolean; message: string }>;
  addCourse: (course: Omit<Course, "id" | "enrolledCount">) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Attendance actions
  saveAttendance: (records: Omit<AttendanceRecord, "id">[]) => Promise<void>;

  // Marks actions
  saveMarks: (marksData: MarkRecord[]) => Promise<void>;
  publishCourseMarks: (courseCode: string) => Promise<void>;

  // Assignment actions
  createAssignment: (assignment: Omit<Assignment, "id" | "totalSubmissions">) => void;
  submitAssignment: (submission: Omit<AssignmentSubmission, "id">) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;

  // Announcement actions
  createAnnouncement: (announcement: Omit<Announcement, "id">) => void;
  markAnnouncementAsRead: (id: string) => void;
  deleteAnnouncement: (id: string) => void;

  // Notification actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Emergency actions
  reportEmergency: (report: Omit<EmergencyReport, "id" | "timestamp" | "status">) => Promise<EmergencyReport>;
  updateEmergencyStatus: (id: string, status: EmergencyReport["status"], notes?: string) => void;

  // Early Warning actions
  addEarlyWarningIntervention: (id: string, note: string) => void;

  // Chat actions
  sendChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;

  // Timetable actions
  addTimetableSlot: (slot: Omit<TimetableSlot, "id">) => void;
  updateTimetableSlot: (id: string, slot: Partial<TimetableSlot>) => void;
  deleteTimetableSlot: (id: string) => void;

  // User actions
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Department actions
  addDepartment: (dept: Omit<Department, "id">) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Academic Sessions
  updateAcademicSession: (id: string, session: Partial<AcademicSession>) => void;

  // AI Assistant
  queryAiAssistant: (question: string) => Promise<string>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DB_STORAGE_KEY = "uninexus_database_v2";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_${key}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(`Error loading state for ${key}:`, e);
    }
    return fallback;
  };

  const [users, setUsers] = useState<User[]>(() => loadState("users", initialUsers));
  const [courses, setCourses] = useState<Course[]>(() => loadState("courses", initialCourses));
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => loadState("enrollments", initialEnrollments));
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(() => loadState("timetableSlots", initialTimetableSlots));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => loadState("attendanceRecords", initialAttendanceRecords));
  const [justifications, setJustifications] = useState<AbsenceJustification[]>(() => loadState("justifications", initialJustifications));
  const [marks, setMarks] = useState<MarkRecord[]>(() => loadState("marks", initialMarks));
  const [assignments, setAssignments] = useState<Assignment[]>(() => loadState("assignments", initialAssignments));
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => loadState("submissions", initialSubmissions));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadState("announcements", initialAnnouncements));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadState("notifications", initialNotifications));
  const [emergencyReports, setEmergencyReports] = useState<EmergencyReport[]>(() => loadState("emergencyReports", initialEmergencyReports));
  const [earlyWarningStudents, setEarlyWarningStudents] = useState<EarlyWarningStudent[]>(() => loadState("earlyWarningStudents", initialEarlyWarningStudents));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadState("chatMessages", initialChatMessages));
  const [departments, setDepartments] = useState<Department[]>(() => loadState("departments", initialDepartments));
  const [faculties] = useState<Faculty[]>(initialFaculties);
  const [programs] = useState<Program[]>(initialPrograms);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>(() => loadState("academicSessions", initialAcademicSessions));

  // Sync helpers
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_courses`, JSON.stringify(courses));
  }, [courses]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_enrollments`, JSON.stringify(enrollments));
  }, [enrollments]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_timetableSlots`, JSON.stringify(timetableSlots));
  }, [timetableSlots]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_attendanceRecords`, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_justifications`, JSON.stringify(justifications));
  }, [justifications]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_marks`, JSON.stringify(marks));
  }, [marks]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_assignments`, JSON.stringify(assignments));
  }, [assignments]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_submissions`, JSON.stringify(submissions));
  }, [submissions]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_announcements`, JSON.stringify(announcements));
  }, [announcements]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_emergencyReports`, JSON.stringify(emergencyReports));
  }, [emergencyReports]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_earlyWarningStudents`, JSON.stringify(earlyWarningStudents));
  }, [earlyWarningStudents]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_chatMessages`, JSON.stringify(chatMessages));
  }, [chatMessages]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_departments`, JSON.stringify(departments));
  }, [departments]);
  useEffect(() => {
    localStorage.setItem(`${DB_STORAGE_KEY}_academicSessions`, JSON.stringify(academicSessions));
  }, [academicSessions]);

  // Absence Justification Actions
  const submitJustification = async (
    data: Omit<AbsenceJustification, "id" | "status" | "submittedAt">
  ): Promise<AbsenceJustification> => {
    const existingActive = justifications.find(
      (j) =>
        j.absenceId === data.absenceId &&
        j.studentId === data.studentId &&
        (j.status === "PENDING" || j.status === "APPROVED")
    );
    if (existingActive) {
      throw new Error(
        `A justification for this absence is already ${existingActive.status}. Duplicate submission is not permitted.`
      );
    }

    const newJust: AbsenceJustification = {
      ...data,
      id: "just-" + Date.now(),
      status: "PENDING",
      submittedAt: new Date().toISOString().split("T")[0],
    };

    setJustifications((prev) => [newJust, ...prev]);

    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === data.absenceId
          ? {
              ...rec,
              status: "Absent",
              absenceStatus: "PENDING",
              justificationId: newJust.id,
              remarks: `Justification pending review`,
            }
          : rec
      )
    );

    const newNotifTeacher: Notification = {
      id: "notif-" + Date.now(),
      title: "New Absence Justification",
      message: `${data.studentName} (${data.studentMatric}) submitted an absence justification for ${data.courseCode} on ${data.absenceDate}.`,
      type: "info",
      timestamp: "Just now",
      isRead: false,
      targetRole: "teacher",
      actionUrl: "/teacher/absences",
    };
    const newNotifAdmin: Notification = {
      id: "notif-" + (Date.now() + 1),
      title: "Absence Justification Submitted",
      message: `Student ${data.studentName} submitted justification for ${data.courseCode} (${data.absenceDate}).`,
      type: "info",
      timestamp: "Just now",
      isRead: false,
      targetRole: "admin",
      actionUrl: "/admin/absences",
    };
    setNotifications((prev) => [newNotifTeacher, newNotifAdmin, ...prev]);

    return newJust;
  };

  const approveJustification = async (id: string, reviewerName: string) => {
    const target = justifications.find((j) => j.id === id);
    if (!target) return;

    const updatedJustification: AbsenceJustification = {
      ...target,
      status: "APPROVED",
      reviewedAt: new Date().toISOString().split("T")[0],
      reviewedByName: reviewerName,
    };

    setJustifications((prev) =>
      prev.map((j) => (j.id === id ? updatedJustification : j))
    );

    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === target.absenceId
          ? {
              ...rec,
              status: "Absent",
              absenceStatus: "EXCUSED",
              remarks: `Absence Excused (Justification approved by ${reviewerName})`,
            }
          : rec
      )
    );

    const studentNotif: Notification = {
      id: "notif-" + Date.now(),
      title: "Absence Justification Approved",
      message: `Your absence justification for ${target.absenceDate} (${target.courseCode}) has been approved. Your absence is now EXCUSED.`,
      type: "success",
      timestamp: "Just now",
      isRead: false,
      targetRole: "student",
      actionUrl: "/student/absences",
    };
    setNotifications((prev) => [studentNotif, ...prev]);
  };

  const rejectJustification = async (id: string, reason: string, reviewerName: string) => {
    const target = justifications.find((j) => j.id === id);
    if (!target) return;

    const updatedJustification: AbsenceJustification = {
      ...target,
      status: "REJECTED",
      rejectionReason: reason || "Document does not sufficiently justify the absence.",
      reviewedAt: new Date().toISOString().split("T")[0],
      reviewedByName: reviewerName,
    };

    setJustifications((prev) =>
      prev.map((j) => (j.id === id ? updatedJustification : j))
    );

    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === target.absenceId
          ? {
              ...rec,
              status: "Absent",
              absenceStatus: "NOT_EXCUSED",
              remarks: `Justification Rejected by ${reviewerName}: ${reason}`,
            }
          : rec
      )
    );

    const studentNotif: Notification = {
      id: "notif-" + Date.now(),
      title: "Absence Justification Rejected",
      message: `Your absence justification for ${target.absenceDate} (${target.courseCode}) was rejected: "${reason}". Absence remains NOT EXCUSED.`,
      type: "warning",
      timestamp: "Just now",
      isRead: false,
      targetRole: "student",
      actionUrl: "/student/absences",
    };
    setNotifications((prev) => [studentNotif, ...prev]);
  };

  // Course actions
  const registerCourse = async (courseId: string, studentId: string, studentName: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return { success: false, message: "Course not found." };

    const isAlreadyRegistered = enrollments.some(
      (e) => e.studentId === studentId && e.courseId === courseId && e.status === "registered"
    );
    if (isAlreadyRegistered) {
      return { success: false, message: `You are already registered for ${course.code} (${course.title}).` };
    }

    // Check maximum credit limit (24 credit hours)
    const currentCredits = enrollments
      .filter((e) => e.studentId === studentId && e.status === "registered")
      .reduce((sum, e) => sum + e.creditHours, 0);

    if (currentCredits + course.creditHours > 24) {
      return {
        success: false,
        message: `Credit limit exceeded! Maximum allowed is 24 credits (Current: ${currentCredits}, Course: ${course.creditHours}).`,
      };
    }

    const newEnrollment: Enrollment = {
      id: "enr-" + Date.now(),
      studentId,
      studentName,
      courseId,
      courseCode: course.code,
      courseTitle: course.title,
      creditHours: course.creditHours,
      semester: course.semester,
      academicYear: "2024/2025",
      registrationDate: new Date().toISOString().split("T")[0],
      status: "registered",
    };

    setEnrollments((prev) => [...prev, newEnrollment]);
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c))
    );

    // Notification
    const newNotif: Notification = {
      id: "notif-" + Date.now(),
      targetRole: "student",
      title: `Course Registered: ${course.code}`,
      message: `You have successfully enrolled in ${course.code} - ${course.title} (${course.creditHours} Credits).`,
      category: "timetable",
      timestamp: "Just now",
      isRead: false,
      actionLink: "/student/courses",
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return { success: true, message: `Successfully registered for ${course.code}!` };
  };

  const dropCourse = async (courseId: string, studentId: string) => {
    const enrollment = enrollments.find(
      (e) => e.studentId === studentId && e.courseId === courseId && e.status === "registered"
    );
    if (!enrollment) {
      return { success: false, message: "Registration not found." };
    }

    setEnrollments((prev) =>
      prev.filter((e) => !(e.studentId === studentId && e.courseId === courseId))
    );
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, enrolledCount: Math.max(0, c.enrolledCount - 1) } : c
      )
    );

    return { success: true, message: `Dropped ${enrollment.courseCode} successfully.` };
  };

  const addCourse = (courseData: Omit<Course, "id" | "enrolledCount">) => {
    const newCourse: Course = {
      ...courseData,
      id: "crs-" + Date.now(),
      enrolledCount: 0,
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...courseData } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Attendance actions
  const saveAttendance = async (records: Omit<AttendanceRecord, "id">[]) => {
    const newRecords: AttendanceRecord[] = records.map((r, i) => ({
      ...r,
      id: `att-${Date.now()}-${i}`,
    }));
    setAttendanceRecords((prev) => [...prev, ...newRecords]);
  };

  // Marks actions
  const saveMarks = async (marksData: MarkRecord[]) => {
    setMarks((prev) => {
      const updated = [...prev];
      marksData.forEach((item) => {
        const idx = updated.findIndex(
          (m) => m.studentId === item.studentId && m.courseCode === item.courseCode
        );
        if (idx >= 0) {
          updated[idx] = item;
        } else {
          updated.push(item);
        }
      });
      return updated;
    });
  };

  const publishCourseMarks = async (courseCode: string) => {
    setMarks((prev) =>
      prev.map((m) => (m.courseCode === courseCode ? { ...m, status: "published" } : m))
    );
    // Notify students
    const newNotif: Notification = {
      id: "notif-" + Date.now(),
      targetRole: "student",
      title: `Official Grades Published: ${courseCode}`,
      message: `Your final semester marks for ${courseCode} have been verified and released.`,
      category: "result",
      timestamp: "Just now",
      isRead: false,
      actionLink: "/student/results",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Assignment actions
  const createAssignment = (assignmentData: Omit<Assignment, "id" | "totalSubmissions">) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: "asg-" + Date.now(),
      totalSubmissions: 0,
    };
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  const submitAssignment = (submissionData: Omit<AssignmentSubmission, "id">) => {
    const existingIndex = submissions.findIndex(
      (s) => s.assignmentId === submissionData.assignmentId && s.studentId === submissionData.studentId
    );

    if (existingIndex >= 0) {
      setSubmissions((prev) => {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...submissionData,
          submissionDate: new Date().toISOString(),
        };
        return updated;
      });
    } else {
      const newSub: AssignmentSubmission = {
        ...submissionData,
        id: "sub-" + Date.now(),
        submissionDate: new Date().toISOString(),
      };
      setSubmissions((prev) => [...prev, newSub]);
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === submissionData.assignmentId
            ? { ...a, totalSubmissions: a.totalSubmissions + 1 }
            : a
        )
      );
    }
  };

  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, score, feedback, status: "graded" }
          : s
      )
    );
  };

  // Announcement actions
  const createAnnouncement = (announcementData: Omit<Announcement, "id">) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: "anc-" + Date.now(),
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Notification actions
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Emergency actions
  const reportEmergency = async (reportData: Omit<EmergencyReport, "id" | "timestamp" | "status">) => {
    const newReport: EmergencyReport = {
      ...reportData,
      id: "emg-" + Date.now(),
      timestamp: new Date().toISOString(),
      status: "Reported",
    };
    setEmergencyReports((prev) => [newReport, ...prev]);

    // Send immediate urgent notification to admins & campus security
    const urgentNotif: Notification = {
      id: "notif-emg-" + Date.now(),
      targetRole: "admin",
      title: `🚨 EMERGENCY ALERT: ${reportData.emergencyType}`,
      message: `${reportData.userName} reported an emergency at ${reportData.location}: "${reportData.description}"`,
      category: "emergency",
      timestamp: "Just now",
      isRead: false,
      actionLink: "/admin/emergency",
    };
    setNotifications((prev) => [urgentNotif, ...prev]);

    return newReport;
  };

  const updateEmergencyStatus = (id: string, status: EmergencyReport["status"], notes?: string) => {
    setEmergencyReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, resolutionNotes: notes || r.resolutionNotes } : r))
    );
  };

  // Early Warning actions
  const addEarlyWarningIntervention = (id: string, note: string) => {
    setEarlyWarningStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              interventionNotes: [...(s.interventionNotes || []), note],
              lastReviewDate: new Date().toISOString().split("T")[0],
            }
          : s
      )
    );
  };

  // Chat actions
  const sendChatMessage = (msgData: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: "msg-" + Date.now(),
      timestamp: "Just now",
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  // Timetable actions
  const addTimetableSlot = (slotData: Omit<TimetableSlot, "id">) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: "tt-" + Date.now(),
    };
    setTimetableSlots((prev) => [...prev, newSlot]);
  };

  const updateTimetableSlot = (id: string, slotData: Partial<TimetableSlot>) => {
    setTimetableSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...slotData } : s))
    );
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetableSlots((prev) => prev.filter((s) => s.id !== id));
  };

  // User actions
  const addUser = (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: "usr-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...userData } : u))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Department actions
  const addDepartment = (deptData: Omit<Department, "id">) => {
    const newDept: Department = {
      ...deptData,
      id: "dept-" + Date.now(),
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const updateDepartment = (id: string, deptData: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...deptData } : d))
    );
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  // Academic Sessions
  const updateAcademicSession = (id: string, sessionData: Partial<AcademicSession>) => {
    setAcademicSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...sessionData } : s))
    );
  };

  // AI Assistant intelligent response generator
  const queryAiAssistant = async (question: string): Promise<string> => {
    await new Promise((res) => setTimeout(res, 800)); // simulated latency
    const normalized = question.toLowerCase();

    for (const item of initialAiKnowledgeBase) {
      if (item.keywords.some((kw) => normalized.includes(kw))) {
        return item.answer;
      }
    }

    if (normalized.includes("hello") || normalized.includes("hi") || normalized.includes("hey")) {
      return "Hello! I am your UniNexus Intelligent Campus Assistant. You can ask me about exam schedules, timetable, course registration, attendance policies, GPA calculations, or emergency campus contacts.";
    }

    return `Here is what I found regarding "${question}":\n\nUniNexus provides centralized management for all academic activities. For specific departmental queries or manual overrides, please reach out to your Academic Advisor or submit an inquiry at the Registrar's Office.`;
  };

  return (
    <DataContext.Provider
      value={{
        users,
        courses,
        enrollments,
        timetableSlots,
        attendanceRecords,
        justifications,
        marks,
        assignments,
        submissions,
        announcements,
        notifications,
        emergencyReports,
        earlyWarningStudents,
        chatMessages,
        departments,
        faculties,
        programs,
        academicSessions,
        submitJustification,
        approveJustification,
        rejectJustification,
        registerCourse,
        dropCourse,
        addCourse,
        updateCourse,
        deleteCourse,
        saveAttendance,
        saveMarks,
        publishCourseMarks,
        createAssignment,
        submitAssignment,
        gradeSubmission,
        createAnnouncement,
        markAnnouncementAsRead,
        deleteAnnouncement,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        reportEmergency,
        updateEmergencyStatus,
        addEarlyWarningIntervention,
        sendChatMessage,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        addUser,
        updateUser,
        deleteUser,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        updateAcademicSession,
        queryAiAssistant,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

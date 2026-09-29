export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  identifier: string; // Student ID (e.g., CS2025001) or Staff ID (e.g., TCH102)
  department: string;
  faculty?: string;
  program?: string;
  level?: string; // HND1, HND2, Level 100, Level 200, etc.
  className?: string; // e.g. BA1A, BA1B, BA2A, etc.
  phone?: string;
  avatar?: string;
  hideInfo?: boolean;
  status: "active" | "inactive" | "suspended";
  coursesTaught?: string[];
  createdAt?: string;
}

export interface StudentProfile extends User {
  cgpa: number;
  currentSemester: string;
  academicYear: string;
  enrollmentDate: string;
  advisorName?: string;
  totalCreditsEarned: number;
  attendanceRate: number;
  activeWarnings: number;
}

export interface TeacherProfile extends User {
  title: string; // Dr., Prof., Mr., Ms.
  officeLocation: string;
  officeHours: string;
  specialization: string;
  coursesCount: number;
  totalStudents: number;
}

export interface Course {
  id: string;
  code: string; // e.g. CS 201
  title: string; // e.g. Data Structures
  creditHours: number;
  department: string;
  faculty: string;
  level: string;
  semester: string; // Semester 1, Semester 2
  lecturerId: string;
  lecturerName: string;
  description: string;
  classroom: string;
  scheduleDays: string; // e.g. "Mon, Wed"
  scheduleTime: string; // e.g. "08:00 - 10:00"
  capacity: number;
  enrolledCount: number;
  status: "available" | "full" | "closed";
  prerequisites?: string[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  semester: string;
  academicYear: string;
  registrationDate: string;
  status: "registered" | "dropped" | "completed";
}

export interface TimetableSlot {
  id: string;
  courseCode?: string;
  courseTitle: string;
  lecturerName: string;
  classroom: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string; // "07:30"
  endTime: string; // "09:30"
  program: string;
  semester: string;
  level?: string; // "Level 1" | "Level 2" | "Level 3"
  className?: string; // e.g. "BA1A", "BA1B", "BA2A", etc.
  hoursProgress?: string; // e.g. "36/40 hrs"
  color?: string;
}

export type AttendanceStatus = "Present" | "Absent" | "Late";

export type AbsenceStatus = "UNJUSTIFIED" | "PENDING" | "EXCUSED" | "NOT_EXCUSED";

export type JustificationStatus = "NOT_JUSTIFIED" | "PENDING" | "APPROVED" | "REJECTED";

export interface AbsenceJustification {
  id: string;
  absenceId: string;
  studentId: string;
  studentName: string;
  studentMatric: string;
  studentAvatar?: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  lecturerId: string;
  lecturerName: string;
  absenceDate: string;
  reason: string;
  comment?: string;
  documentUrl: string;
  documentName: string;
  documentType: string;
  documentSize: number; // in bytes
  status: JustificationStatus;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle?: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  date: string;
  session: string; // e.g. "07:30 - 09:30", "Period 1 (07:30 - 09:30)", etc.
  status: AttendanceStatus;
  absenceStatus?: AbsenceStatus;
  justificationId?: string;
  remarks?: string;
  lecturerId?: string;
  lecturerName?: string;
}

export interface StudentAttendanceSummary {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: "Good Standing" | "Warning" | "Critical";
}

export interface MarkRecord {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  semester: string;
  academicYear: string;
  courseworkMark: number; // /30 or /40
  examMark: number; // /70 or /60
  totalMark: number; // /100
  grade: string; // A+, A, B, C, D, F
  gradePoint: number; // 4.0, 3.5, etc.
  status: "draft" | "submitted" | "published";
  remarks?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  lecturerId: string;
  lecturerName: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  attachmentUrl?: string;
  totalSubmissions: number;
  status: "active" | "closed";
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  fileUrl?: string;
  content: string;
  score?: number;
  feedback?: string;
  status: "submitted" | "graded" | "late";
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  content?: string;
  author: string;
  authorRole: "Admin" | "Teacher";
  date: string;
  targetAudience: "All" | "Students" | "Teachers" | "Department";
  department?: string;
  priority: "High" | "Normal" | "Low";
  category: "Academic" | "Exam" | "Events" | "Policy" | "General";
  courseCode?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  isRead?: boolean;
}

export interface Notification {
  id: string;
  userId?: string;
  targetRole?: UserRole | "all";
  title: string;
  message: string;
  category?: "announcement" | "result" | "attendance" | "timetable" | "assignment" | "emergency" | "admin" | string;
  type?: string;
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
  actionUrl?: string;
}

export interface EmergencyReport {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userPhone: string;
  location: string;
  emergencyType: "Medical" | "Security" | "Fire" | "Harassment" | "Other";
  description: string;
  timestamp: string;
  status: "Reported" | "Dispatched" | "In Progress" | "Resolved";
  resolutionNotes?: string;
}

export interface EarlyWarningStudent {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  avatar?: string;
  program: string;
  department: string;
  level: string;
  riskType: "Low Attendance" | "Low Marks" | "Previous Warning" | "Multiple Factors";
  attendanceRate: number;
  averageMark: number;
  coursesAtRisk: string[];
  status: "At Risk" | "Warning" | "Good Standing";
  interventionNotes?: string[];
  lastReviewDate: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  channelId?: string; // e.g. general, study-help, announcements, events
  recipientId?: string; // for direct messages
  content: string;
  timestamp: string;
  fileAttachment?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  faculty: string;
  headOfDepartment: string;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  dean: string;
  departmentsCount: number;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  department: string;
  durationYears: number;
  levels: string[];
}

export interface AcademicSession {
  id: string;
  name: string; // e.g. 2024/2025
  currentSemester: "Semester 1" | "Semester 2" | "Summer";
  startDate: string;
  endDate: string;
  registrationOpen: boolean;
  resultsPublished: boolean;
  isActive: boolean;
}

export interface TeacherAvailabilitySlot {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string; // "07:30"
  endTime: string;   // "09:30"
  periodLabel: string; // "07:30 - 09:30"
  isAvailable: boolean;
}

export interface TeacherAvailabilitySubmission {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  department: string;
  academicYear: string;
  semester: string;
  submittedAt: string;
  slots: TeacherAvailabilitySlot[];
  maxHoursPerWeek?: number;
  notes?: string;
  status: "SUBMITTED" | "REVIEWED" | "APPROVED";
}

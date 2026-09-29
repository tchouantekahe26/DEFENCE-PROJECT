import User from './user/user.model.js';
import Student from './student/student.model.js';
import AbsenceJustification from './justification/justification.model.js';
import Course from './course/course.model.js';
import Attendance from './attendance/attendance.model.js';
import Result from './results/results.model.js';
import Enrollment from './enrollment/enrollment.model.js';
import { TimetableSlot, TimetablePublication } from './timetable/timetable.model.js';
import AcademicSession from './session/session.model.js';
import { Assignment, AssignmentSubmission } from './assignment/assignment.model.js';
import Announcement from './announcement/announcement.model.js';
import Notification from './notification/notification.model.js';
import EmergencyReport from './emergency/emergency.model.js';
import EarlyWarning from './early-warning/earlyWarning.model.js';
import ChatMessage from './chat/chat.model.js';
import { Faculty, Department, Program } from './institution/institution.model.js';

// Associations (configured with constraints: false for flexible data handling)
User.hasOne(Student, { foreignKey: 'userId', constraints: false });
Student.belongsTo(User, { foreignKey: 'userId', constraints: false });

User.hasMany(Enrollment, { foreignKey: 'studentId', constraints: false });
Enrollment.belongsTo(User, { foreignKey: 'studentId', constraints: false });

Course.hasMany(Enrollment, { foreignKey: 'courseId', constraints: false });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', constraints: false });

Course.hasMany(Assignment, { foreignKey: 'courseId', constraints: false });
Assignment.belongsTo(Course, { foreignKey: 'courseId', constraints: false });

Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignmentId', constraints: false });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignmentId', constraints: false });

User.hasMany(AssignmentSubmission, { foreignKey: 'studentId', constraints: false });
AssignmentSubmission.belongsTo(User, { foreignKey: 'studentId', constraints: false });

User.hasMany(Attendance, { foreignKey: 'studentId', constraints: false });
Attendance.belongsTo(User, { foreignKey: 'studentId', constraints: false });

Course.hasMany(Attendance, { foreignKey: 'courseId', constraints: false });
Attendance.belongsTo(Course, { foreignKey: 'courseId', constraints: false });

User.hasMany(Result, { foreignKey: 'studentId', constraints: false });
Result.belongsTo(User, { foreignKey: 'studentId', constraints: false });

Course.hasMany(Result, { foreignKey: 'courseId', constraints: false });
Result.belongsTo(Course, { foreignKey: 'courseId', constraints: false });

User.hasMany(Notification, { foreignKey: 'userId', constraints: false });
Notification.belongsTo(User, { foreignKey: 'userId', constraints: false });

export {
  User,
  Student,
  AbsenceJustification,
  Course,
  Attendance,
  Result,
  Enrollment,
  TimetableSlot,
  TimetablePublication,
  AcademicSession,
  Assignment,
  AssignmentSubmission,
  Announcement,
  Notification,
  EmergencyReport,
  EarlyWarning,
  ChatMessage,
  Faculty,
  Department,
  Program,
};

export default {
  User,
  Student,
  AbsenceJustification,
  Course,
  Attendance,
  Result,
  Enrollment,
  TimetableSlot,
  TimetablePublication,
  AcademicSession,
  Assignment,
  AssignmentSubmission,
  Announcement,
  Notification,
  EmergencyReport,
  EarlyWarning,
  ChatMessage,
  Faculty,
  Department,
  Program,
};

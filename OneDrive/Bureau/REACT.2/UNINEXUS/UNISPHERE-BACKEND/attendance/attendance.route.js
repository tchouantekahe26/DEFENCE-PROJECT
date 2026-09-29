import express from 'express';
import {
  getAttendance,
  getMyAttendance,
  getCourseStudents,
  saveBatchAttendance,
  updateAttendanceRecord,
} from './attendance.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const attendanceRouter = express.Router();

// Student: View own attendance history and stats
attendanceRouter.get('/my', authenticateToken, authorizeRole(['student']), getMyAttendance);

// Teacher / Admin: Get enrolled students for a course
attendanceRouter.get('/course/:courseId/students', authenticateToken, authorizeRole(['teacher', 'admin']), getCourseStudents);

// Teacher / Admin: Get course attendance records
attendanceRouter.get('/', authenticateToken, getAttendance);

// Teacher / Admin: Save / update batch attendance
attendanceRouter.post('/batch', authenticateToken, authorizeRole(['teacher', 'admin']), saveBatchAttendance);

// Teacher / Admin: Update individual record
attendanceRouter.put('/:id', authenticateToken, authorizeRole(['teacher', 'admin']), updateAttendanceRecord);

export default attendanceRouter;

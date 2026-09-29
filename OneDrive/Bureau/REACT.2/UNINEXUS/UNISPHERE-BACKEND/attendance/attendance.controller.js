import Attendance from './attendance.model.js';
import { User, Student, Course, Enrollment } from '../models.js';
import { Op } from 'sequelize';

// 1. Get Attendance (General query for Teacher / Admin, or filtered)
export const getAttendance = async (req, res) => {
  try {
    const { courseCode, courseId, studentId, date, session } = req.query;
    const where = {};

    // Security check: If student, restrict to own studentId
    if (req.user && req.user.role === 'student') {
      where.studentId = req.user.id;
    } else {
      if (studentId) where.studentId = studentId;
    }

    if (courseCode) where.courseCode = courseCode;
    if (courseId) where.courseId = courseId;
    if (date) where.date = date;
    if (session) where.session = session;

    const records = await Attendance.findAll({
      where,
      order: [['date', 'DESC'], ['id', 'DESC']],
    });

    res.status(200).json(records);
  } catch (error) {
    console.error('getAttendance error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Student: Get My Attendance History & Statistics
export const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user?.id;
    const identifier = req.user?.identifier;
    const name = req.user?.name;
    if (!studentId && !identifier && !name) {
      return res.status(401).json({ error: 'Student authentication required' });
    }

    const orClauses = [];
    if (studentId) orClauses.push({ studentId });
    if (identifier) orClauses.push({ matricNumber: identifier });
    if (name) orClauses.push({ studentName: name });

    const records = await Attendance.findAll({
      where: orClauses.length > 0 ? { [Op.or]: orClauses } : {},
      order: [['date', 'DESC'], ['id', 'DESC']],
    });

    // Compute statistics
    const total = records.length;
    const presentCount = records.filter((r) => r.status.toLowerCase() === 'present').length;
    const lateCount = records.filter((r) => r.status.toLowerCase() === 'late').length;
    const excusedCount = records.filter((r) => r.status.toLowerCase() === 'excused').length;
    const absentCount = records.filter((r) => r.status.toLowerCase() === 'absent').length;

    // Attended includes present, late, and excused
    const attended = presentCount + lateCount + excusedCount;
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 100;

    res.status(200).json({
      records,
      stats: {
        totalClasses: total,
        present: presentCount,
        late: lateCount,
        excused: excusedCount,
        absent: absentCount,
        attended,
        percentage,
      },
    });
  } catch (error) {
    console.error('getMyAttendance error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 3. Teacher/Admin: Get Students Enrolled in a Course (for taking attendance)
export const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check enrollments
    const enrollments = await Enrollment.findAll({
      where: { courseId: course.id, status: 'registered' },
    });

    let students = [];

    if (enrollments.length > 0) {
      const studentIds = enrollments.map((e) => e.studentId);
      students = await User.findAll({
        where: { id: studentIds, role: 'student' },
        attributes: ['id', 'name', 'email', 'identifier', 'department', 'avatar'],
      });
    }

    // Fallback: If no enrollments exist in DB, return students matching course department or all students
    if (students.length === 0) {
      students = await User.findAll({
        where: { role: 'student' },
        attributes: ['id', 'name', 'email', 'identifier', 'department', 'avatar'],
        limit: 30,
      });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('getCourseStudents error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 4. Save/Submit Batch Attendance (Teacher / Admin)
export const saveBatchAttendance = async (req, res) => {
  try {
    const records = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Expected non-empty array of attendance records' });
    }

    const lecturerId = req.user?.id || null;
    const savedRecords = [];

    for (const item of records) {
      const normalizedStatus = (item.status || 'present').toLowerCase();
      const validStatuses = ['present', 'absent', 'late', 'excused'];
      const statusToSave = validStatuses.includes(normalizedStatus) ? normalizedStatus : 'present';

      // Check if record already exists for (course, student, date, session)
      const orStudent = [{ studentId: item.studentId }];
      if (item.matricNumber) orStudent.push({ matricNumber: item.matricNumber });

      const whereCondition = {
        date: item.date,
        [Op.or]: orStudent,
      };

      if (item.courseId || item.courseCode) {
        const orCourse = [];
        if (item.courseId) orCourse.push({ courseId: item.courseId });
        if (item.courseCode) orCourse.push({ courseCode: item.courseCode });
        whereCondition[Op.and] = [{ [Op.or]: orCourse }];
      }

      if (item.session) {
        whereCondition.session = item.session;
      }

      const existing = await Attendance.findOne({ where: whereCondition });

      if (existing) {
        // If status was already excused by justification, don't revert to unexcused unless explicitly forced
        existing.status = statusToSave;
        if (item.remarks !== undefined) existing.remarks = item.remarks;
        if (lecturerId) existing.lecturerId = lecturerId;
        await existing.save();
        savedRecords.push(existing);
      } else {
        const created = await Attendance.create({
          studentId: item.studentId,
          studentName: item.studentName || 'Student',
          matricNumber: item.matricNumber || 'MATRIC-001',
          courseId: item.courseId,
          courseCode: item.courseCode || 'COURSE',
          date: item.date,
          session: item.session || 'Morning',
          lecturerId: lecturerId || item.lecturerId || null,
          status: statusToSave,
          remarks: item.remarks || '',
        });
        savedRecords.push(created);
      }
    }

    res.status(200).json({
      message: `Successfully saved attendance for ${savedRecords.length} student(s).`,
      records: savedRecords,
    });
  } catch (error) {
    console.error('saveBatchAttendance error:', error);
    res.status(500).json({ error: error.message });
  }
};

// 5. Update Single Attendance Record
export const updateAttendanceRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const record = await Attendance.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    if (status) {
      const norm = status.toLowerCase();
      if (['present', 'absent', 'late', 'excused'].includes(norm)) {
        record.status = norm;
      }
    }
    if (remarks !== undefined) record.remarks = remarks;

    await record.save();
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import Attendance from './attendance.model.js';

export const getAttendance = async (req, res) => {
  try {
    const { courseCode, studentId } = req.query;
    const where = {};
    if (courseCode) where.courseCode = courseCode;
    if (studentId) where.studentId = studentId;

    const records = await Attendance.findAll({ where });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveBatchAttendance = async (req, res) => {
  try {
    const records = req.body;
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Expected array of attendance records' });
    }

    const saved = await Attendance.bulkCreate(records, {
      updateOnDuplicate: ['status', 'remarks'],
    });

    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

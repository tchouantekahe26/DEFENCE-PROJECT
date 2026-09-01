import Result from './results.model.js';

export const getResults = async (req, res) => {
  try {
    const { studentId, courseCode, status } = req.query;
    const where = {};
    if (studentId) where.studentId = studentId;
    if (courseCode) where.courseCode = courseCode;
    if (status) where.status = status;

    const results = await Result.findAll({ where });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveBatchMarks = async (req, res) => {
  try {
    const records = req.body;
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Expected array of mark records' });
    }

    const saved = await Result.bulkCreate(records, {
      updateOnDuplicate: [
        'courseworkMark',
        'examMark',
        'totalMark',
        'grade',
        'gradePoint',
        'status',
      ],
    });

    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const publishCourseResults = async (req, res) => {
  try {
    const { courseCode } = req.body;
    if (!courseCode) {
      return res.status(400).json({ error: 'courseCode is required' });
    }

    await Result.update(
      { status: 'published' },
      { where: { courseCode } }
    );

    res.status(200).json({ message: `Results for ${courseCode} published successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

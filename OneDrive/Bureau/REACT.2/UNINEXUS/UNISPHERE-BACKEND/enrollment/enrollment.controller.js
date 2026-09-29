import Enrollment from './enrollment.model.js';

export const getEnrollments = async (req, res) => {
  try {
    const { studentId, courseId } = req.query;
    const where = {};
    if (studentId) where.studentId = studentId;
    if (courseId) where.courseId = courseId;

    const enrollments = await Enrollment.findAll({ where });
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Enrollment.update({ status }, { where: { id } });
    const updated = await Enrollment.findByPk(id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    await Enrollment.destroy({ where: { id } });
    res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

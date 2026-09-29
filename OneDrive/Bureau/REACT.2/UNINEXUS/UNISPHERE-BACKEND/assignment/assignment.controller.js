import { Assignment, AssignmentSubmission } from './assignment.model.js';

export const getAssignments = async (req, res) => {
  try {
    const { courseId, lecturerId } = req.query;
    const where = {};
    if (courseId) where.courseId = courseId;
    if (lecturerId) where.lecturerId = lecturerId;

    const assignments = await Assignment.findAll({ where });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubmissions = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.query;
    const where = {};
    if (assignmentId) where.assignmentId = assignmentId;
    if (studentId) where.studentId = studentId;

    const submissions = await AssignmentSubmission.findAll({ where });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const submission = await AssignmentSubmission.create(req.body);
    // increment assignment totalSubmissions
    if (submission.assignmentId) {
      await Assignment.increment('totalSubmissions', { where: { id: submission.assignmentId } });
    }
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, feedback, status } = req.body;
    await AssignmentSubmission.update(
      { score, feedback, status: status || 'graded' },
      { where: { id } }
    );
    const updated = await AssignmentSubmission.findByPk(id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

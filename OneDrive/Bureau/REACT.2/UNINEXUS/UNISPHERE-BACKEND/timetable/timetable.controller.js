import { TimetableSlot, TimetablePublication } from './timetable.model.js';
import Notification from '../notification/notification.model.js';

export const getTimetable = async (req, res) => {
  try {
    const { program, semester, day } = req.query;
    const where = {};
    if (program) where.program = program;
    if (semester) where.semester = semester;
    if (day) where.day = day;

    const slots = await TimetableSlot.findAll({ where });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTimetableSlot = async (req, res) => {
  try {
    const slot = await TimetableSlot.create(req.body);
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    await TimetableSlot.update(req.body, { where: { id } });
    const updated = await TimetableSlot.findByPk(id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    await TimetableSlot.destroy({ where: { id } });
    res.status(200).json({ message: 'Timetable slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Publish Timetable PDF & send notifications to students and teachers
export const publishTimetable = async (req, res) => {
  try {
    const {
      program = 'All Programs',
      semester = 'Semester 1 (2024/2025)',
      academicYear = '2024/2025',
      publishedBy = 'Academic Administration',
      fileUrl = '',
      fileName = 'Official_Timetable.pdf',
      notes = 'Official academic timetable published by administration.',
    } = req.body;

    const publishedAt = new Date().toISOString();

    const publication = await TimetablePublication.create({
      program,
      semester,
      academicYear,
      publishedBy,
      fileUrl,
      fileName,
      notes,
      publishedAt,
      status: 'published',
    });

    // Send notifications to Students
    await Notification.create({
      targetRole: 'student',
      title: '📅 New Timetable Available',
      message: `The official academic timetable for ${program} (${semester}) has been published in PDF format. You can download it now.`,
      category: 'timetable',
      type: 'info',
      timestamp: publishedAt,
      actionLink: '/student/timetable',
    });

    // Send notifications to Teachers
    await Notification.create({
      targetRole: 'teacher',
      title: '📅 Lecture Timetable Published',
      message: `The official academic timetable for ${program} (${semester}) has been published in PDF format for faculty review.`,
      category: 'timetable',
      type: 'info',
      timestamp: publishedAt,
      actionLink: '/teacher/timetable',
    });

    res.status(201).json({
      message: 'Timetable PDF successfully saved and sent to students and teachers',
      publication,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublishedTimetables = async (req, res) => {
  try {
    const { program, semester } = req.query;
    const where = { status: 'published' };
    if (program) where.program = program;
    if (semester) where.semester = semester;

    const publications = await TimetablePublication.findAll({
      where,
      order: [['id', 'DESC']],
    });
    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

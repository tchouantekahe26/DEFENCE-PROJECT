import Announcement from './announcement.model.js';
import { emitAnnouncement } from '../socket.js';
import { Op } from 'sequelize';

export const getAnnouncements = async (req, res) => {
  try {
    const { targetAudience, category, department } = req.query;
    const where = {};

    if (category) where.category = category;
    if (department) where.department = department;

    // Audience targeting logic based on user role
    if (req.user) {
      const userRole = req.user.role?.toLowerCase();
      const userDept = req.user.department;

      if (userRole === 'student') {
        const studentConditions = [
          { targetAudience: 'All' },
          { targetAudience: 'Students' },
        ];
        if (userDept) {
          studentConditions.push({
            targetAudience: 'Department',
            department: userDept,
          });
        }
        where[Op.or] = studentConditions;
      } else if (userRole === 'teacher') {
        const teacherConditions = [
          { targetAudience: 'All' },
          { targetAudience: 'Teachers' },
          { targetAudience: 'Students' }, // Teachers can see notices sent to students
        ];
        if (userDept) {
          teacherConditions.push({
            targetAudience: 'Department',
            department: userDept,
          });
        }
        where[Op.or] = teacherConditions;
      }
      // If admin, no restrictions on where
    } else if (targetAudience) {
      where.targetAudience = targetAudience;
    }

    const announcements = await Announcement.findAll({
      where,
      order: [['id', 'DESC']],
    });

    res.status(200).json(announcements);
  } catch (error) {
    console.error('getAnnouncements error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      description,
      targetAudience,
      department,
      className,
      courseCode,
      priority,
      category,
      attachmentUrl,
      attachmentName,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description/content are required.' });
    }

    const authorName = req.user?.name || req.body.author || 'University Administration';
    const authorRole = req.user?.role === 'teacher' ? 'Teacher' : 'Admin';

    const announcement = await Announcement.create({
      title,
      description,
      author: authorName,
      authorRole: req.body.authorRole || authorRole,
      date: req.body.date || new Date().toISOString().split('T')[0],
      targetAudience: targetAudience || 'All',
      department: department || req.user?.department || null,
      className: className || null,
      courseCode: courseCode || null,
      priority: priority || 'Normal',
      category: category || 'General',
      attachmentUrl: attachmentUrl || null,
      attachmentName: attachmentName || null,
    });

    // Real-time broadcast via Socket.IO
    try {
      emitAnnouncement(announcement.toJSON());
    } catch (socketErr) {
      console.warn('Socket emission non-critical error:', socketErr.message);
    }

    res.status(201).json(announcement);
  } catch (error) {
    console.error('createAnnouncement error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Role check: Admin can delete all; Teacher can delete own
    if (req.user && req.user.role === 'teacher') {
      if (announcement.authorRole !== 'Teacher' && announcement.author !== req.user.name) {
        return res.status(403).json({ error: 'Unauthorized to delete this announcement.' });
      }
    }

    await announcement.destroy();
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

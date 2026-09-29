import express from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from './announcement.controller.js';
import {
  authenticateToken,
  authorizeRole,
  optionalAuthenticateToken,
} from '../middleware/auth.middleware.js';

const announcementRouter = express.Router();

// Get announcements (filtered by user role/dept if authenticated)
announcementRouter.get('/', optionalAuthenticateToken, getAnnouncements);

// Create announcement (Teacher or Admin)
announcementRouter.post('/', authenticateToken, authorizeRole(['teacher', 'admin']), createAnnouncement);

// Delete announcement (Teacher or Admin)
announcementRouter.delete('/:id', authenticateToken, authorizeRole(['teacher', 'admin']), deleteAnnouncement);

export default announcementRouter;

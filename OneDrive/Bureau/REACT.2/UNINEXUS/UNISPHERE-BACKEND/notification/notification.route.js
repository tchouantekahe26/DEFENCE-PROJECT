import express from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
} from './notification.controller.js';

const notificationRouter = express.Router();

notificationRouter.get('/', getNotifications);
notificationRouter.post('/', createNotification);
notificationRouter.put('/:id/read', markAsRead);
notificationRouter.post('/read-all', markAllAsRead);

export default notificationRouter;

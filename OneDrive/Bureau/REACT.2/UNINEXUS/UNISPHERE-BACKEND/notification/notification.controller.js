import Notification from './notification.model.js';
import { Op } from 'sequelize';

export const getNotifications = async (req, res) => {
  try {
    const { userId, role } = req.query;
    const whereConditions = [];

    if (userId) {
      whereConditions.push({ userId });
    }
    if (role) {
      whereConditions.push({ targetRole: role });
    }
    whereConditions.push({ targetRole: 'all' });

    const notifications = await Notification.findAll({
      where: {
        [Op.or]: whereConditions,
      },
      order: [['id', 'DESC']],
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.update({ isRead: true }, { where: { id } });
    const updated = await Notification.findByPk(id);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    const where = {};
    if (userId) where.userId = userId;

    await Notification.update({ isRead: true }, { where });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

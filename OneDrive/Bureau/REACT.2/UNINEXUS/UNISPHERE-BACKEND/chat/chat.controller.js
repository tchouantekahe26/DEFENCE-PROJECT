import ChatMessage from './chat.model.js';
import { Op } from 'sequelize';

export const getMessages = async (req, res) => {
  try {
    const { channelId, userId, otherUserId } = req.query;

    if (channelId) {
      const messages = await ChatMessage.findAll({
        where: { channelId },
        order: [['id', 'ASC']],
      });
      return res.status(200).json(messages);
    }

    if (userId && otherUserId) {
      const messages = await ChatMessage.findAll({
        where: {
          [Op.or]: [
            { senderId: userId, recipientId: otherUserId },
            { senderId: otherUserId, recipientId: userId },
          ],
        },
        order: [['id', 'ASC']],
      });
      return res.status(200).json(messages);
    }

    const messages = await ChatMessage.findAll({ order: [['id', 'ASC']] });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const message = await ChatMessage.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

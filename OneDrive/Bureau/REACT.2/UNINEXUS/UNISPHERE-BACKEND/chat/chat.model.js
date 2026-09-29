import { DataTypes } from 'sequelize';
import { sequelize } from '../db.connect.js';

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  senderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderRole: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    defaultValue: 'student',
  },
  senderAvatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  channelId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileAttachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default ChatMessage;

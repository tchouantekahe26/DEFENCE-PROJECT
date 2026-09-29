import { DataTypes } from 'sequelize';
import { sequelize } from '../db.connect.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  targetRole: {
    type: DataTypes.STRING,
    defaultValue: 'all',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'general',
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'info',
  },
  timestamp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  actionLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Notification;

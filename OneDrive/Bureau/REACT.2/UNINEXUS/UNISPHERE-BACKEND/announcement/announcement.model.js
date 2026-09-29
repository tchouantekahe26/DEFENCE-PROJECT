import { DataTypes } from 'sequelize';
import { sequelize } from '../db.connect.js';

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorRole: {
    type: DataTypes.ENUM('Admin', 'Teacher'),
    defaultValue: 'Admin',
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  targetAudience: {
    type: DataTypes.ENUM('All', 'Students', 'Teachers', 'Department'),
    defaultValue: 'All',
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  className: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  courseCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attachmentUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attachmentName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM('High', 'Normal', 'Low'),
    defaultValue: 'Normal',
  },
  category: {
    type: DataTypes.ENUM('Academic', 'Exam', 'Events', 'Policy', 'General'),
    defaultValue: 'General',
  },
}, {
  tableName: 'announcements',
});

export default Announcement;

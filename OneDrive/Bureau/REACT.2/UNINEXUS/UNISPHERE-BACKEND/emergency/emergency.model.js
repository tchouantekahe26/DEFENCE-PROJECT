import { DataTypes } from 'sequelize';
import { sequelize } from '../db.connect.js';

const EmergencyReport = sequelize.define('EmergencyReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userRole: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    defaultValue: 'student',
  },
  userPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emergencyType: {
    type: DataTypes.ENUM('Medical', 'Security', 'Fire', 'Harassment', 'Other'),
    defaultValue: 'Medical',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('Reported', 'Dispatched', 'In Progress', 'Resolved'),
    defaultValue: 'Reported',
  },
  resolutionNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'emergencyreports',
});

export default EmergencyReport;

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.connect.js';

const EarlyWarning = sequelize.define('EarlyWarning', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  matricNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  program: {
    type: DataTypes.STRING,
    defaultValue: 'B.Sc. Computer Science',
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: 'Computer Science',
  },
  level: {
    type: DataTypes.STRING,
    defaultValue: 'HND 2',
  },
  riskType: {
    type: DataTypes.ENUM('Low Attendance', 'Low Marks', 'Previous Warning', 'Multiple Factors'),
    defaultValue: 'Low Attendance',
  },
  attendanceRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  averageMark: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  coursesAtRisk: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('At Risk', 'Warning', 'Good Standing'),
    defaultValue: 'At Risk',
  },
  interventionNotes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  lastReviewDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default EarlyWarning;

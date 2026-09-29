import { DataTypes } from 'sequelize';
import { sequelize } from '../db.connect.js';

export const TimetableSlot = sequelize.define('TimetableSlot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lecturerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classroom: {
    type: DataTypes.STRING,
    defaultValue: 'Room 101',
  },
  day: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    allowNull: false,
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  program: {
    type: DataTypes.STRING,
    defaultValue: 'B.Sc. Computer Science',
  },
  semester: {
    type: DataTypes.STRING,
    defaultValue: 'Semester 1',
  },
  className: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Level 2',
  },
  hoursProgress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#4F46E5',
  },
}, {
  tableName: 'timetables',
});

export const TimetablePublication = sequelize.define('TimetablePublication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  program: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  academicYear: {
    type: DataTypes.STRING,
    defaultValue: '2024/2025',
  },
  publishedBy: {
    type: DataTypes.STRING,
    defaultValue: 'Academic Administration',
  },
  fileUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fileName: {
    type: DataTypes.STRING,
    defaultValue: 'Official_Timetable.pdf',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  publishedAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('published', 'archived'),
    defaultValue: 'published',
  },
}, {
  tableName: 'timetablepublications',
});

export default TimetableSlot;

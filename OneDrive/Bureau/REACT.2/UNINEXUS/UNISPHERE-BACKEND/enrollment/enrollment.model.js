import { DataTypes } from 'sequelize';
import { sequelize } from '../db.connect.js';

const Enrollment = sequelize.define('Enrollment', {
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
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  courseCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creditHours: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  },
  semester: {
    type: DataTypes.STRING,
    defaultValue: 'Semester 1',
  },
  academicYear: {
    type: DataTypes.STRING,
    defaultValue: '2024/2025',
  },
  registrationDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('registered', 'dropped', 'completed'),
    defaultValue: 'registered',
  },
});

export default Enrollment;

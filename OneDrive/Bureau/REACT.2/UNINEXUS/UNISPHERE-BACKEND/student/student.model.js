import { DataTypes } from 'sequelize';
import { sequelize } from '../db.connect.js';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  matricNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: 'Computer Science',
  },
  faculty: {
    type: DataTypes.STRING,
    defaultValue: 'School of Computing',
  },
  program: {
    type: DataTypes.STRING,
    defaultValue: 'B.Sc. Computer Science',
  },
  level: {
    type: DataTypes.STRING,
    defaultValue: 'HND 2',
  },
  className: {
    type: DataTypes.STRING,
    defaultValue: 'BA1A',
  },
  cgpa: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  currentSemester: {
    type: DataTypes.STRING,
    defaultValue: 'Semester 1',
  },
  academicYear: {
    type: DataTypes.STRING,
    defaultValue: '2024/2025',
  },
  enrollmentDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  advisorName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalCreditsEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  attendanceRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  activeWarnings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  avatar: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  },
}, {
  tableName: 'students',
});

export default Student;

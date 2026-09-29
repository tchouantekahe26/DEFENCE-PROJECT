import { DataTypes } from 'sequelize';
import { sequelize } from '../db.connect.js';

const AcademicSession = sequelize.define('AcademicSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '2024/2025',
  },
  currentSemester: {
    type: DataTypes.ENUM('Semester 1', 'Semester 2', 'Summer'),
    defaultValue: 'Semester 1',
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registrationOpen: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  resultsPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default AcademicSession;

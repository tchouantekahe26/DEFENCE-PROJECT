import { DataTypes } from 'sequelize';
import { sequelize } from '../db.connect.js';

export const Faculty = sequelize.define('Faculty', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  dean: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  departmentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  headOfDepartment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalTeachers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalCourses: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  durationYears: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
  },
  levels: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: ['Level 100', 'Level 200', 'Level 300', 'Level 400'],
  },
});

export default { Faculty, Department, Program };

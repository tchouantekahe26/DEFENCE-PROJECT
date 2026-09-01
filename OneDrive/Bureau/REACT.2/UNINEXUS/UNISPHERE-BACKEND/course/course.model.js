import { DataTypes } from "sequelize";
import { sequelize } from "../db.connect.js";

const Course = sequelize.define("Course", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creditHours: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: "Computer Science",
  },
  faculty: {
    type: DataTypes.STRING,
    defaultValue: "School of Computing",
  },
  level: {
    type: DataTypes.STRING,
    defaultValue: "HND 2",
  },
  semester: {
    type: DataTypes.STRING,
    defaultValue: "Semester 1",
  },
  lecturerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  classroom: {
    type: DataTypes.STRING,
    defaultValue: "Room 101",
  },
  scheduleDays: {
    type: DataTypes.STRING,
    defaultValue: "Monday, Wednesday",
  },
  scheduleTime: {
    type: DataTypes.STRING,
    defaultValue: "08:00 - 10:00",
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
  },
  enrolledCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Course;

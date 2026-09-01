import { DataTypes } from "sequelize";
import { sequelize } from "../db.connect.js";

const Result = sequelize.define("Result", {
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
    defaultValue: "Semester 1",
  },
  academicYear: {
    type: DataTypes.STRING,
    defaultValue: "2024/2025",
  },
  courseworkMark: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  examMark: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalMark: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  grade: {
    type: DataTypes.STRING,
    defaultValue: "F",
  },
  gradePoint: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.ENUM("draft", "submitted", "published"),
    defaultValue: "draft",
  },
});

export default Result;

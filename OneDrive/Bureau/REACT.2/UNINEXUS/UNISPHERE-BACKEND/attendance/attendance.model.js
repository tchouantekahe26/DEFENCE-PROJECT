import { DataTypes } from "sequelize";
import { sequelize } from "../db.connect.js";

const Attendance = sequelize.define("Attendance", {
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
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  session: {
    type: DataTypes.ENUM("Morning", "Afternoon", "Evening"),
    defaultValue: "Morning",
  },
  lecturerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("present", "absent", "late", "excused"),
    defaultValue: "present",
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Attendance;

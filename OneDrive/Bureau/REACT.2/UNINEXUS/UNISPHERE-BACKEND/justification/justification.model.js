import { DataTypes } from "sequelize";
import { sequelize } from "../db.connect.js";

const AbsenceJustification = sequelize.define("AbsenceJustification", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  absenceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentMatric: {
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
    allowNull: true,
  },
  lecturerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lecturerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  absenceDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  documentPath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  documentUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  documentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documentSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
    defaultValue: "PENDING",
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  submittedAt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewedAt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reviewedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default AbsenceJustification;

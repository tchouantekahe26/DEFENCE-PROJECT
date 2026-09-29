import { DataTypes } from "sequelize";
import { sequelize } from "../db.connect.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("student", "teacher", "admin"),
    defaultValue: "student",
  },
  identifier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Computer Science",
  },
  faculty: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "School of Computing",
  },
  program: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "B.Sc. Computer Science",
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "HND 2",
  },
  className: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "BA1A",
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  hideInfo: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive", "suspended"),
    defaultValue: "active",
  },
});

export default User;

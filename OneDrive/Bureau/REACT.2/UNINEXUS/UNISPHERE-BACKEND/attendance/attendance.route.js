import express from 'express';
import { getAttendance, saveBatchAttendance } from './attendance.controller.js';

const attendanceRouter = express.Router();

attendanceRouter.get('/', getAttendance);
attendanceRouter.post('/batch', saveBatchAttendance);

export default attendanceRouter;

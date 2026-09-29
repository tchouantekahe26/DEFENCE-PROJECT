import http from 'http';
import express from 'express';
import cors from 'cors';
import { connectDB, sequelize } from './db.connect.js';
import { initSocket } from './socket.js';

// Import central models to ensure all tables are registered before sync
import './models.js';

// Import route handlers
import userRouter from './user/user.route.js';
import justificationRouter from './justification/justification.route.js';
import courseRouter from './course/course.route.js';
import attendanceRouter from './attendance/attendance.route.js';
import resultsRouter from './results/results.route.js';
import enrollmentRouter from './enrollment/enrollment.route.js';
import timetableRouter from './timetable/timetable.route.js';
import sessionRouter from './session/session.route.js';
import assignmentRouter from './assignment/assignment.route.js';
import announcementRouter from './announcement/announcement.route.js';
import notificationRouter from './notification/notification.route.js';
import emergencyRouter from './emergency/emergency.route.js';
import earlyWarningRouter from './early-warning/earlyWarning.route.js';
import chatRouter from './chat/chat.route.js';
import institutionRouter from './institution/institution.route.js';
import studentRouter from './student/student.route.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with server
initSocket(server);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Mount API routes
app.use('/api/users', userRouter);
app.use('/api/students', studentRouter);
app.use('/api/absence-justifications', justificationRouter);
app.use('/api/courses', courseRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/results', resultsRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/timetables', timetableRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/assignments', assignmentRouter);
app.use('/api/announcements', announcementRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/early-warnings', earlyWarningRouter);
app.use('/api/chat', chatRouter);
app.use('/api/institution', institutionRouter);

export { app };

export async function startServer() {
  server.listen(3000, async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log('Server is running on port 3000 (with Socket.IO)');
  });
}

if (process.argv[1] && new URL(import.meta.url).pathname === new URL(`file://${process.argv[1].replaceAll('\\', '/')}`).pathname) {
  startServer();
}

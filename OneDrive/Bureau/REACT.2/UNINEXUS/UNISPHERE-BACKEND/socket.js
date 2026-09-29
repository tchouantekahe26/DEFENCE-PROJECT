import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    const rawToken =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!rawToken) {
      // Allow connection even without token for guest/initial load, but unauthenticated
      socket.user = { id: 'guest', role: 'guest' };
      return next();
    }

    try {
      if (rawToken.startsWith('demo_jwt_token_')) {
        // Handle mock/demo tokens from frontend gracefully
        const parts = rawToken.split('_');
        const demoRole = parts[3] || 'student';
        socket.user = { id: 1, role: demoRole, department: 'Computer Science' };
      } else {
        const decoded = jwt.verify(rawToken, JWT_SECRET);
        socket.user = decoded;
      }
      return next();
    } catch (err) {
      console.warn('Socket token validation warning:', err.message);
      socket.user = { id: 'anonymous', role: 'guest' };
      return next();
    }
  });

  io.on('connection', (socket) => {
    const userRole = socket.user?.role?.toLowerCase() || 'guest';
    const userId = socket.user?.id;
    const department = socket.user?.department;

    // Join role-based rooms
    if (userRole) {
      socket.join(`role:${userRole}`);
    }
    if (userId) {
      socket.join(`user:${userId}`);
    }
    if (department) {
      socket.join(`dept:${department}`);
    }

    console.log(`🔌 Socket connected: ${socket.id} (User: ${userId}, Role: ${userRole})`);

    // Handle course-specific room subscription
    socket.on('join_course', (courseCode) => {
      if (courseCode) {
        socket.join(`course:${courseCode}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

/**
 * Broadcast announcement to authorized recipients in real time
 */
export const emitAnnouncement = (announcement) => {
  if (!io) return;

  const target = announcement.targetAudience;
  const dept = announcement.department;
  const courseCode = announcement.courseCode;

  console.log(`📢 Emitting announcement #${announcement.id} [Target: ${target}]`);

  if (target === 'All') {
    io.emit('new_announcement', announcement);
  } else if (target === 'Students') {
    io.to('role:student').to('role:admin').to('role:teacher').emit('new_announcement', announcement);
  } else if (target === 'Teachers') {
    io.to('role:teacher').to('role:admin').emit('new_announcement', announcement);
  } else if (target === 'Department' && dept) {
    io.to(`dept:${dept}`).to('role:admin').emit('new_announcement', announcement);
  } else if (courseCode) {
    io.to(`course:${courseCode}`).to('role:admin').emit('new_announcement', announcement);
  } else {
    // Default fallback
    io.emit('new_announcement', announcement);
  }
};

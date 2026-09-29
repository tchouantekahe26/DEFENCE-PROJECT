import { io, Socket } from 'socket.io-client';
import type { Announcement } from '../types';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: ((announcement: Announcement) => void)[] = [];

  public connect(token?: string) {
    if (this.socket && this.socket.connected) {
      return;
    }

    const authToken = token || localStorage.getItem('uninexus_token') || '';

    this.socket = io(SOCKET_URL, {
      auth: { token: authToken },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to UNISPHERE Real-Time Server');
    });

    this.socket.on('connect_error', (err: Error) => {
      console.warn('Real-time connection notice:', err.message);
    });

    this.socket.on('new_announcement', (announcement: Announcement) => {
      console.log('🔔 Received real-time announcement:', announcement.title);
      this.listeners.forEach((callback) => callback(announcement));
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Real-time disconnected:', reason);
    });
  }

  public subscribeToAnnouncements(callback: (announcement: Announcement) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public joinCourse(courseCode: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_course', courseCode);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }
}

export const socketService = new SocketService();

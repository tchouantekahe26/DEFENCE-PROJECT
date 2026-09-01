const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
  // Auth & Users
  register: async (formData: {
    fullName: string;
    email: string;
    password: string;
    id: string;
    role?: string;
    department?: string;
    level?: string;
    courses?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          identifier: formData.id,
          role: formData.role || 'student',
          department: formData.department || '',
          level: formData.level || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  login: async (formData: {
    emailOrId: string;
    password: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.emailOrId,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/get-all-users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Courses
  getCourses: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Attendance
  getAttendance: async (courseId?: string) => {
    try {
      const url = courseId ? `${API_BASE_URL}/attendance?courseId=${courseId}` : `${API_BASE_URL}/attendance`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch attendance');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Results / Marks
  getResults: async (studentId?: string) => {
    try {
      const url = studentId ? `${API_BASE_URL}/results?studentId=${studentId}` : `${API_BASE_URL}/results`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch results');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Announcements
  getAnnouncements: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch announcements');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Emergency
  postEmergency: async (data: Record<string, unknown>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/emergency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to post emergency');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};

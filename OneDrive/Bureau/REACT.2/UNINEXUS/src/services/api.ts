const API_BASE_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('uninexus_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

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
    className?: string;
    courses?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        identifier: formData.id,
        role: formData.role || 'student',
        department: formData.department || '',
        level: formData.level || '',
        className: formData.className || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Registration failed');
    }

    return await response.json();
  },

  login: async (formData: {
    emailOrId: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: formData.emailOrId,
        password: formData.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Login failed');
    }

    return await response.json();
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users/get-all-users`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch users');
    }

    return await response.json();
  },

  // Courses
  getCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return await response.json();
  },

  // ================= ATTENDANCE =================
  getAttendance: async (params?: { courseId?: string; courseCode?: string; date?: string; session?: string; studentId?: string }) => {
    const query = new URLSearchParams();
    if (params?.courseId) query.append('courseId', params.courseId);
    if (params?.courseCode) query.append('courseCode', params.courseCode);
    if (params?.date) query.append('date', params.date);
    if (params?.session) query.append('session', params.session);
    if (params?.studentId) query.append('studentId', params.studentId);

    const url = `${API_BASE_URL}/attendance${query.toString() ? '?' + query.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch attendance');
    return await response.json();
  },

  getMyAttendance: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance/my`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch my attendance');
    return await response.json();
  },

  getCourseStudents: async (courseId: string) => {
    const response = await fetch(`${API_BASE_URL}/attendance/course/${courseId}/students`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch course students');
    return await response.json();
  },

  saveBatchAttendance: async (records: unknown[]) => {
    const response = await fetch(`${API_BASE_URL}/attendance/batch`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(records),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save attendance');
    }
    return await response.json();
  },

  updateAttendanceRecord: async (id: string, data: { status?: string; remarks?: string }) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update attendance record');
    return await response.json();
  },

  // ================= ABSENCE JUSTIFICATIONS =================
  getMyJustifications: async () => {
    const response = await fetch(`${API_BASE_URL}/absence-justifications/my`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch justifications');
    return await response.json();
  },

  getJustifications: async () => {
    const response = await fetch(`${API_BASE_URL}/absence-justifications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch justifications');
    return await response.json();
  },

  submitJustification: async (data: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}/absence-justifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit absence justification');
    }
    return await response.json();
  },

  approveJustification: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/absence-justifications/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to approve justification');
    return await response.json();
  },

  rejectJustification: async (id: string, rejectionReason: string) => {
    const response = await fetch(`${API_BASE_URL}/absence-justifications/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rejectionReason }),
    });
    if (!response.ok) throw new Error('Failed to reject justification');
    return await response.json();
  },

  // ================= ANNOUNCEMENTS =================
  getAnnouncements: async (params?: { category?: string; targetAudience?: string; department?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.targetAudience) query.append('targetAudience', params.targetAudience);
    if (params?.department) query.append('department', params.department);

    const url = `${API_BASE_URL}/announcements${query.toString() ? '?' + query.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch announcements');
    return await response.json();
  },

  createAnnouncement: async (data: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create announcement');
    }
    return await response.json();
  },

  deleteAnnouncement: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete announcement');
    return await response.json();
  },

  // Results / Marks
  getResults: async (params?: { studentId?: string; courseCode?: string; status?: string } | string) => {
    let url = `${API_BASE_URL}/results`;
    if (typeof params === 'string') {
      url = `${API_BASE_URL}/results?studentId=${params}`;
    } else if (params) {
      const queryParams = new URLSearchParams();
      if (params.studentId) queryParams.append('studentId', params.studentId);
      if (params.courseCode) queryParams.append('courseCode', params.courseCode);
      if (params.status) queryParams.append('status', params.status);
      url = `${API_BASE_URL}/results${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch results');
    return await response.json();
  },

  // Emergency
  postEmergency: async (data: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}/emergency`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to post emergency');
    return await response.json();
  },

  // Timetable PDF Publishing & Distribution
  publishTimetablePdf: async (data: {
    program: string;
    semester: string;
    academicYear?: string;
    publishedBy?: string;
    notes?: string;
    fileUrl?: string;
    fileName?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/timetables/publish`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to publish timetable PDF');
    return await response.json();
  },

  getPublishedTimetables: async (program?: string, semester?: string) => {
    const queryParams = new URLSearchParams();
    if (program) queryParams.append('program', program);
    if (semester) queryParams.append('semester', semester);
    const url = `${API_BASE_URL}/timetables/published${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch published timetables');
    return await response.json();
  },

  // Results batch save

  saveBatchMarks: async (records: unknown[]) => {
    const response = await fetch(`${API_BASE_URL}/results/batch`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(records),
    });
    if (!response.ok) throw new Error('Failed to save batch marks');
    return await response.json();
  },
};

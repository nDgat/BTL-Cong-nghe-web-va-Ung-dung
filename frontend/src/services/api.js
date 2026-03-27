import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
};

// Users
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Subjects
export const subjectAPI = {
  getAll: (params) => api.get('/subjects', { params }),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

// Classes
export const classAPI = {
  getAll: (params) => api.get('/classes', { params }),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  getMyClasses: () => api.get('/classes/my-classes'),
  getEnrolled: () => api.get('/classes/enrolled'),
};

// Schedules
export const scheduleAPI = {
  getAll: (params) => api.get('/schedules', { params }),
  getByClass: (classId) => api.get(`/schedules/class/${classId}`),
  create: (data) => api.post('/schedules', data),
  bulkCreate: (data) => api.post('/schedules/bulk', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
};

// Enrollments
export const enrollmentAPI = {
  getAll: (params) => api.get('/enrollments', { params }),
  enroll: (data) => api.post('/enrollments', data),
  bulkEnroll: (data) => api.post('/enrollments/bulk', data),
  drop: (id) => api.put(`/enrollments/${id}/drop`),
};

// Attendance
export const attendanceAPI = {
  getAll: (params) => api.get('/attendances', { params }),
  takeAttendance: (data) => api.post('/attendances/take', data),
  update: (id, data) => api.put(`/attendances/${id}`, data),
  getClassSummary: (classId) => api.get(`/attendances/class/${classId}/summary`),
  getBySession: (scheduleId) => api.get(`/attendances/session/${scheduleId}`),
  checkWarnings: (classId) => api.post(`/attendances/class/${classId}/check-warnings`),
};

// Grades
export const gradeAPI = {
  getAll: (params) => api.get('/grades', { params }),
  inputGrades: (data) => api.post('/grades/input', data),
  update: (id, data) => api.put(`/grades/${id}`, data),
  calculateFinal: (classId) => api.post(`/grades/class/${classId}/calculate`),
  getTranscript: (studentId) => api.get(`/grades/transcript/${studentId || ''}`),
};

// Appeals
export const appealAPI = {
  getAll: (params) => api.get('/appeals', { params }),
  getById: (id) => api.get(`/appeals/${id}`),
  create: (data) => api.post('/appeals', data),
  review: (id, data) => api.put(`/appeals/${id}/review`, data),
};

// Notifications
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  send: (data) => api.post('/notifications', data),
};

// Reports
export const reportAPI = {
  dashboard: () => api.get('/reports/dashboard'),
  gradeDistribution: (classId) => api.get(`/reports/grade-distribution/${classId}`),
  passRate: (params) => api.get('/reports/pass-rate', { params }),
  attendance: (params) => api.get('/reports/attendance', { params }),
};

// Export
export const exportAPI = {
  gradesExcel: (classId) => api.get(`/export/grades/${classId}/excel`, { responseType: 'blob' }),
  gradesCSV: (classId) => api.get(`/export/grades/${classId}/csv`, { responseType: 'blob' }),
  attendanceExcel: (classId) => api.get(`/export/attendance/${classId}/excel`, { responseType: 'blob' }),
  transcriptPDF: (studentId) => api.get(`/export/transcript/${studentId || ''}/pdf`, { responseType: 'blob' }),
  importStudents: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/import/students', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

// Audit Logs
export const auditAPI = {
  getAll: (params) => api.get('/audit-logs', { params }),
};

export default api;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { authenticate, authorize } = require('../middleware/auth');
const { auditMiddleware } = require('../middleware/audit');

// Controllers
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const subjectController = require('../controllers/subjectController');
const classController = require('../controllers/classController');
const scheduleController = require('../controllers/scheduleController');
const enrollmentController = require('../controllers/enrollmentController');
const attendanceController = require('../controllers/attendanceController');
const gradeController = require('../controllers/gradeController');
const appealController = require('../controllers/appealController');
const notificationController = require('../controllers/notificationController');
const reportController = require('../controllers/reportController');
const exportController = require('../controllers/exportController');
const { AuditLog } = require('../models');
const { getPagination, getPaginationData } = require('../utils/helpers');

// Multer for file uploads
const upload = multer({ dest: path.join(__dirname, '../../uploads/') });

// ===== AUTH =====
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticate, authController.getProfile);
router.put('/auth/profile', authenticate, authController.updateProfile);
router.put('/auth/change-password', authenticate, authController.changePassword);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password/:token', authController.resetPassword);
router.post('/auth/refresh-token', authController.refreshToken);

// ===== USERS (Admin) =====
router.get('/users', authenticate, authorize('admin'), userController.getAll);
router.get('/users/:id', authenticate, authorize('admin'), userController.getById);
router.post('/users', authenticate, authorize('admin'), userController.create);
router.put('/users/:id', authenticate, authorize('admin'), userController.update);
router.delete('/users/:id', authenticate, authorize('admin'), userController.delete);
router.post('/users/:id/restore', authenticate, authorize('admin'), userController.restore);

// ===== SUBJECTS =====
router.get('/subjects', authenticate, subjectController.getAll);
router.get('/subjects/:id', authenticate, subjectController.getById);
router.post('/subjects', authenticate, authorize('admin'), subjectController.create);
router.put('/subjects/:id', authenticate, authorize('admin'), subjectController.update);
router.delete('/subjects/:id', authenticate, authorize('admin'), subjectController.delete);

// ===== CLASSES =====
router.get('/classes', authenticate, classController.getAll);
router.get('/classes/my-classes', authenticate, authorize('lecturer'), classController.getMyClasses);
router.get('/classes/enrolled', authenticate, authorize('student'), classController.getEnrolledClasses);
router.get('/classes/:id', authenticate, classController.getById);
router.post('/classes', authenticate, authorize('admin'), classController.create);
router.put('/classes/:id', authenticate, authorize('admin', 'lecturer'), classController.update);
router.delete('/classes/:id', authenticate, authorize('admin'), classController.delete);

// ===== SCHEDULES =====
router.get('/schedules', authenticate, scheduleController.getAll);
router.get('/schedules/class/:classId', authenticate, scheduleController.getByClass);
router.get('/schedules/:id', authenticate, scheduleController.getById);
router.post('/schedules', authenticate, authorize('admin', 'lecturer'), scheduleController.create);
router.post('/schedules/bulk', authenticate, authorize('admin', 'lecturer'), scheduleController.bulkCreate);
router.put('/schedules/:id', authenticate, authorize('admin', 'lecturer'), scheduleController.update);
router.delete('/schedules/:id', authenticate, authorize('admin', 'lecturer'), scheduleController.delete);

// ===== ENROLLMENTS =====
router.get('/enrollments', authenticate, enrollmentController.getAll);
router.get('/enrollments/:id', authenticate, enrollmentController.getById);
router.post('/enrollments', authenticate, authorize('admin', 'student'), enrollmentController.enroll);
router.post('/enrollments/bulk', authenticate, authorize('admin'), enrollmentController.bulkEnroll);
router.put('/enrollments/:id/drop', authenticate, enrollmentController.drop);
router.delete('/enrollments/:id', authenticate, authorize('admin'), enrollmentController.delete);

// ===== ATTENDANCE =====
router.get('/attendances', authenticate, attendanceController.getAll);
router.post('/attendances/take', authenticate, authorize('admin', 'lecturer'), attendanceController.takeAttendance);
router.put('/attendances/:id', authenticate, authorize('admin', 'lecturer'), attendanceController.update);
router.get('/attendances/class/:classId/summary', authenticate, attendanceController.getClassSummary);
router.get('/attendances/session/:scheduleId', authenticate, attendanceController.getBySession);
router.post('/attendances/class/:classId/check-warnings', authenticate, authorize('admin', 'lecturer', 'advisor'), attendanceController.checkWarnings);

// ===== GRADES =====
router.get('/grades', authenticate, gradeController.getAll);
router.post('/grades/input', authenticate, authorize('admin', 'lecturer'), gradeController.inputGrades);
router.put('/grades/:id', authenticate, authorize('admin', 'lecturer'), gradeController.update);
router.post('/grades/class/:classId/calculate', authenticate, authorize('admin', 'lecturer'), gradeController.calculateFinalGrades);
router.get('/grades/transcript', authenticate, gradeController.getTranscript);
router.get('/grades/transcript/:studentId', authenticate, gradeController.getTranscript);

// ===== APPEALS =====
router.get('/appeals', authenticate, appealController.getAll);
router.get('/appeals/:id', authenticate, appealController.getById);
router.post('/appeals', authenticate, authorize('student'), appealController.create);
router.put('/appeals/:id/review', authenticate, authorize('admin', 'lecturer'), appealController.review);

// ===== NOTIFICATIONS =====
router.get('/notifications', authenticate, notificationController.getMyNotifications);
router.put('/notifications/:id/read', authenticate, notificationController.markAsRead);
router.put('/notifications/read-all', authenticate, notificationController.markAllAsRead);
router.delete('/notifications/:id', authenticate, notificationController.delete);
router.post('/notifications', authenticate, authorize('admin'), notificationController.send);
router.post('/notifications/bulk', authenticate, authorize('admin'), notificationController.sendBulk);

// ===== REPORTS =====
router.get('/reports/dashboard', authenticate, authorize('admin', 'lecturer', 'advisor'), reportController.dashboard);
router.get('/reports/grade-distribution/:classId', authenticate, authorize('admin', 'lecturer'), reportController.gradeDistribution);
router.get('/reports/pass-rate', authenticate, authorize('admin', 'lecturer'), reportController.passRate);
router.get('/reports/attendance', authenticate, authorize('admin', 'lecturer', 'advisor'), reportController.attendanceReport);

// ===== EXPORT / IMPORT =====
router.get('/export/grades/:classId/excel', authenticate, authorize('admin', 'lecturer'), exportController.exportGradesToExcel);
router.get('/export/grades/:classId/csv', authenticate, authorize('admin', 'lecturer'), exportController.exportGradesToCSV);
router.get('/export/attendance/:classId/excel', authenticate, authorize('admin', 'lecturer'), exportController.exportAttendanceToExcel);
router.get('/export/transcript/pdf', authenticate, exportController.exportTranscriptPDF);
router.get('/export/transcript/:studentId/pdf', authenticate, exportController.exportTranscriptPDF);
router.post('/import/students', authenticate, authorize('admin'), upload.single('file'), exportController.importStudentsFromExcel);

// ===== AUDIT LOGS (Admin) =====
router.get('/audit-logs', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = {};
    if (req.query.action) where.action = req.query.action;
    if (req.query.entity) where.entity = req.query.entity;
    if (req.query.user_id) where.user_id = req.query.user_id;

    const data = await AuditLog.findAndCountAll({
      where, limit, offset,
      order: [['created_at', 'DESC']],
    });
    const result = getPaginationData(data, page, limit);
    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) { next(error); }
});

// ===== HEALTH CHECK =====
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

module.exports = router;

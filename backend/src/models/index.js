const sequelize = require('../config/database');
const User = require('./User');
const Subject = require('./Subject');
const Class = require('./Class');
const Schedule = require('./Schedule');
const Enrollment = require('./Enrollment');
const Attendance = require('./Attendance');
const Grade = require('./Grade');
const Appeal = require('./Appeal');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');

// ===== Associations =====

// Subject - Class
Subject.hasMany(Class, { foreignKey: 'subject_id', as: 'classes' });
Class.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

// User (Lecturer) - Class
User.hasMany(Class, { foreignKey: 'lecturer_id', as: 'teaching_classes' });
Class.belongsTo(User, { foreignKey: 'lecturer_id', as: 'lecturer' });

// Class - Schedule
Class.hasMany(Schedule, { foreignKey: 'class_id', as: 'schedules' });
Schedule.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

// User (Student) - Enrollment
User.hasMany(Enrollment, { foreignKey: 'student_id', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Class - Enrollment
Class.hasMany(Enrollment, { foreignKey: 'class_id', as: 'enrollments' });
Enrollment.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

// Enrollment - Attendance
Enrollment.hasMany(Attendance, { foreignKey: 'enrollment_id', as: 'attendances' });
Attendance.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });

// Schedule - Attendance
Schedule.hasMany(Attendance, { foreignKey: 'schedule_id', as: 'attendances' });
Attendance.belongsTo(Schedule, { foreignKey: 'schedule_id', as: 'schedule' });

// User (Student) - Attendance
User.hasMany(Attendance, { foreignKey: 'student_id', as: 'attendances' });
Attendance.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Class - Attendance
Class.hasMany(Attendance, { foreignKey: 'class_id', as: 'class_attendances' });
Attendance.belongsTo(Class, { foreignKey: 'class_id', as: 'attendance_class' });

// Enrollment - Grade
Enrollment.hasMany(Grade, { foreignKey: 'enrollment_id', as: 'grades' });
Grade.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });

// User (Student) - Grade
User.hasMany(Grade, { foreignKey: 'student_id', as: 'grades' });
Grade.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Class - Grade
Class.hasMany(Grade, { foreignKey: 'class_id', as: 'grades' });
Grade.belongsTo(Class, { foreignKey: 'class_id', as: 'grade_class' });

// User (Student) - Appeal
User.hasMany(Appeal, { foreignKey: 'student_id', as: 'appeals' });
Appeal.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Grade - Appeal
Grade.hasMany(Appeal, { foreignKey: 'grade_id', as: 'appeals' });
Appeal.belongsTo(Grade, { foreignKey: 'grade_id', as: 'grade' });

// Class - Appeal
Class.hasMany(Appeal, { foreignKey: 'class_id', as: 'appeals' });
Appeal.belongsTo(Class, { foreignKey: 'class_id', as: 'appeal_class' });

// User (Reviewer) - Appeal
User.hasMany(Appeal, { foreignKey: 'reviewed_by', as: 'reviewed_appeals' });
Appeal.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

// User - Notification
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User - AuditLog
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'audit_logs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Subject,
  Class,
  Schedule,
  Enrollment,
  Attendance,
  Grade,
  Appeal,
  Notification,
  AuditLog,
};

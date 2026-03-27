const { Enrollment, Class, Subject, User, Attendance, Grade, Schedule, sequelize } = require('../models');
const { Op } = require('sequelize');

// Grade distribution report for a class
exports.gradeDistribution = async (req, res, next) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findByPk(classId, {
      include: [{ model: Subject, as: 'subject' }],
    });
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });

    const enrollments = await Enrollment.findAll({
      where: { class_id: classId },
      attributes: ['final_grade', 'letter_grade', 'status'],
    });

    const distribution = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D+': 0, 'D': 0, 'F': 0 };
    let totalGraded = 0;
    let totalPassed = 0;
    let sumGrades = 0;

    enrollments.forEach(e => {
      if (e.letter_grade && distribution[e.letter_grade] !== undefined) {
        distribution[e.letter_grade]++;
        totalGraded++;
        sumGrades += e.final_grade || 0;
        if (e.final_grade >= 4.0) totalPassed++;
      }
    });

    res.json({
      data: {
        class_info: { id: cls.id, code: cls.code, name: cls.name, subject: cls.subject?.name },
        total_students: enrollments.length,
        total_graded: totalGraded,
        pass_rate: totalGraded > 0 ? ((totalPassed / totalGraded) * 100).toFixed(1) : 0,
        average_grade: totalGraded > 0 ? (sumGrades / totalGraded).toFixed(2) : 0,
        distribution,
      },
    });
  } catch (error) { next(error); }
};

// Pass rate report across all classes (by semester/year)
exports.passRate = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.academic_year) where.academic_year = req.query.academic_year;
    if (req.query.semester) where.semester = req.query.semester;

    const classes = await Class.findAll({
      where,
      include: [
        { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
        {
          model: Enrollment, as: 'enrollments',
          attributes: ['final_grade', 'letter_grade', 'status'],
        },
      ],
    });

    const report = classes.map(cls => {
      const total = cls.enrollments.length;
      const passed = cls.enrollments.filter(e => e.final_grade >= 4.0).length;
      const graded = cls.enrollments.filter(e => e.final_grade !== null).length;

      return {
        class_id: cls.id,
        class_code: cls.code,
        class_name: cls.name,
        subject: cls.subject?.name,
        total_students: total,
        graded: graded,
        passed: passed,
        failed: graded - passed,
        pass_rate: graded > 0 ? ((passed / graded) * 100).toFixed(1) : 'N/A',
      };
    });

    res.json({ data: report });
  } catch (error) { next(error); }
};

// Attendance report
exports.attendanceReport = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.academic_year) where.academic_year = req.query.academic_year;
    if (req.query.semester) where.semester = req.query.semester;

    const classes = await Class.findAll({
      where,
      include: [
        { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
      ],
    });

    const report = [];
    for (const cls of classes) {
      const totalSessions = await Schedule.count({ where: { class_id: cls.id, is_cancelled: false } });
      const totalEnrolled = await Enrollment.count({ where: { class_id: cls.id, status: 'enrolled' } });

      const presentCount = await Attendance.count({ where: { class_id: cls.id, status: 'present' } });
      const absentCount = await Attendance.count({ where: { class_id: cls.id, status: 'absent' } });
      const lateCount = await Attendance.count({ where: { class_id: cls.id, status: 'late' } });
      const excusedCount = await Attendance.count({ where: { class_id: cls.id, status: 'excused' } });

      const totalExpected = totalSessions * totalEnrolled;
      const attendanceRate = totalExpected > 0 ? ((presentCount + lateCount) / totalExpected * 100).toFixed(1) : 'N/A';

      const warnedCount = await Enrollment.count({ where: { class_id: cls.id, is_warned: true } });

      report.push({
        class_id: cls.id,
        class_code: cls.code,
        class_name: cls.name,
        subject: cls.subject?.name,
        total_sessions: totalSessions,
        total_students: totalEnrolled,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        excused: excusedCount,
        attendance_rate: attendanceRate,
        warned_students: warnedCount,
      });
    }

    res.json({ data: report });
  } catch (error) { next(error); }
};

// Dashboard statistics
exports.dashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalLecturers = await User.count({ where: { role: 'lecturer' } });
    const totalSubjects = await Subject.count();
    const totalClasses = await Class.count();
    const activeClasses = await Class.count({ where: { status: 'active' } });
    const totalEnrollments = await Enrollment.count();

    res.json({
      data: {
        total_students: totalStudents,
        total_lecturers: totalLecturers,
        total_subjects: totalSubjects,
        total_classes: totalClasses,
        active_classes: activeClasses,
        total_enrollments: totalEnrollments,
      },
    });
  } catch (error) { next(error); }
};

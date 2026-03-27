const { Attendance, Enrollment, Schedule, Class, User, Notification } = require('../models');
const { getPagination, getPaginationData } = require('../utils/helpers');
const { createAuditLog } = require('../middleware/audit');
const { Op } = require('sequelize');

// Get attendance records
exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = {};
    if (req.query.class_id) where.class_id = req.query.class_id;
    if (req.query.student_id) where.student_id = req.query.student_id;
    if (req.query.schedule_id) where.schedule_id = req.query.schedule_id;
    if (req.query.status) where.status = req.query.status;

    const data = await Attendance.findAndCountAll({
      where, limit, offset,
      include: [
        { model: User, as: 'student', attributes: ['id', 'full_name', 'student_code'] },
        { model: Schedule, as: 'schedule', attributes: ['id', 'session_date', 'start_time', 'end_time', 'session_number'] },
      ],
      order: [['created_at', 'DESC']],
    });
    const result = getPaginationData(data, page, limit);
    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) { next(error); }
};

// Take attendance for a session (batch)
exports.takeAttendance = async (req, res, next) => {
  try {
    const { schedule_id, class_id, attendances } = req.body;
    // attendances: [{ student_id, enrollment_id, status, note }]

    const results = [];
    for (const att of attendances) {
      const [record, created] = await Attendance.findOrCreate({
        where: { enrollment_id: att.enrollment_id, schedule_id },
        defaults: {
          student_id: att.student_id,
          class_id,
          schedule_id,
          enrollment_id: att.enrollment_id,
          status: att.status || 'present',
          check_in_time: att.status === 'present' || att.status === 'late' ? new Date() : null,
          note: att.note,
          recorded_by: req.user.id,
        },
      });

      if (!created) {
        const oldValues = record.toJSON();
        record.status = att.status;
        record.note = att.note;
        record.recorded_by = req.user.id;
        if (att.status === 'present' || att.status === 'late') {
          record.check_in_time = new Date();
        }
        await record.save();
      }
      results.push(record);
    }

    // Update absent counts for enrollments
    await updateAbsentCounts(class_id);

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'TAKE_ATTENDANCE', entity: 'Attendance',
      newValues: { schedule_id, class_id, count: attendances.length }, req,
    });

    res.json({ message: 'Điểm danh thành công', data: results });
  } catch (error) { next(error); }
};

// Update single attendance
exports.update = async (req, res, next) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) return res.status(404).json({ error: 'Không tìm thấy bản ghi điểm danh' });

    const oldValues = attendance.toJSON();
    await attendance.update(req.body);

    // Update absent count
    await updateAbsentCounts(attendance.class_id);

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'UPDATE', entity: 'Attendance', entityId: attendance.id,
      oldValues, newValues: req.body, req,
    });

    res.json({ message: 'Cập nhật điểm danh thành công', data: attendance });
  } catch (error) { next(error); }
};

// Get attendance summary for a class
exports.getClassSummary = async (req, res, next) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findByPk(classId);
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });

    const enrollments = await Enrollment.findAll({
      where: { class_id: classId, status: 'enrolled' },
      include: [
        { model: User, as: 'student', attributes: ['id', 'full_name', 'student_code', 'email'] },
      ],
    });

    const totalSessions = await Schedule.count({ where: { class_id: classId, is_cancelled: false } });

    const summary = [];
    for (const enrollment of enrollments) {
      const attendances = await Attendance.findAll({
        where: { enrollment_id: enrollment.id },
      });

      const present = attendances.filter(a => a.status === 'present').length;
      const absent = attendances.filter(a => a.status === 'absent').length;
      const late = attendances.filter(a => a.status === 'late').length;
      const excused = attendances.filter(a => a.status === 'excused').length;
      const absentPercent = totalSessions > 0 ? ((absent / totalSessions) * 100).toFixed(1) : 0;

      summary.push({
        student: enrollment.student,
        enrollment_id: enrollment.id,
        total_sessions: totalSessions,
        present,
        absent,
        late,
        excused,
        absent_percent: parseFloat(absentPercent),
        is_warned: parseFloat(absentPercent) > cls.max_absent_percent,
      });
    }

    res.json({
      data: {
        class_info: cls,
        total_sessions: totalSessions,
        max_absent_percent: cls.max_absent_percent,
        students: summary,
      },
    });
  } catch (error) { next(error); }
};

// Get attendance for a specific session
exports.getBySession = async (req, res, next) => {
  try {
    const attendances = await Attendance.findAll({
      where: { schedule_id: req.params.scheduleId },
      include: [
        { model: User, as: 'student', attributes: ['id', 'full_name', 'student_code'] },
      ],
    });
    res.json({ data: attendances });
  } catch (error) { next(error); }
};

// Check and send warnings for excessive absence
exports.checkWarnings = async (req, res, next) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findByPk(classId);
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });

    const totalSessions = await Schedule.count({ where: { class_id: classId, is_cancelled: false } });
    if (totalSessions === 0) return res.json({ data: { warnings: [] } });

    const enrollments = await Enrollment.findAll({
      where: { class_id: classId, status: 'enrolled' },
      include: [{ model: User, as: 'student' }],
    });

    const warnings = [];
    for (const enrollment of enrollments) {
      const absentCount = await Attendance.count({
        where: { enrollment_id: enrollment.id, status: 'absent' },
      });

      const absentPercent = (absentCount / totalSessions) * 100;
      if (absentPercent > cls.max_absent_percent) {
        // Create notification
        await Notification.create({
          user_id: enrollment.student_id,
          title: 'Cảnh báo chuyên cần',
          message: `Bạn đã vắng ${absentCount}/${totalSessions} buổi (${absentPercent.toFixed(1)}%) trong lớp ${cls.name}. Vượt quá giới hạn ${cls.max_absent_percent}%.`,
          type: 'warning',
          link: `/classes/${classId}/attendance`,
        });

        enrollment.is_warned = true;
        enrollment.absent_count = absentCount;
        await enrollment.save();

        warnings.push({
          student: enrollment.student.toJSON(),
          absent_count: absentCount,
          absent_percent: absentPercent.toFixed(1),
        });
      }
    }

    res.json({
      message: `Đã kiểm tra và gửi ${warnings.length} cảnh báo`,
      data: { warnings },
    });
  } catch (error) { next(error); }
};

// Helper: Update absent counts for all enrollments in a class
async function updateAbsentCounts(classId) {
  const enrollments = await Enrollment.findAll({ where: { class_id: classId } });
  for (const enrollment of enrollments) {
    const absentCount = await Attendance.count({
      where: { enrollment_id: enrollment.id, status: 'absent' },
    });
    enrollment.absent_count = absentCount;
    await enrollment.save({ hooks: false });
  }
}

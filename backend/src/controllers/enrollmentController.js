const { Enrollment, Class, Subject, User } = require('../models');
const { getPagination, getPaginationData } = require('../utils/helpers');
const { createAuditLog } = require('../middleware/audit');

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = {};
    if (req.query.class_id) where.class_id = req.query.class_id;
    if (req.query.student_id) where.student_id = req.query.student_id;
    if (req.query.status) where.status = req.query.status;

    const data = await Enrollment.findAndCountAll({
      where, limit, offset,
      include: [
        { model: User, as: 'student', attributes: ['id', 'full_name', 'student_code', 'email'] },
        { model: Class, as: 'class', include: [{ model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] }] },
      ],
      order: [['created_at', 'DESC']],
    });
    const result = getPaginationData(data, page, limit);
    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'student' },
        { model: Class, as: 'class', include: [{ model: Subject, as: 'subject' }] },
      ],
    });
    if (!enrollment) return res.status(404).json({ error: 'Không tìm thấy đăng ký' });
    res.json({ data: enrollment });
  } catch (error) { next(error); }
};

// Enroll student in class
exports.enroll = async (req, res, next) => {
  try {
    const { student_id, class_id } = req.body;

    // Check class capacity
    const cls = await Class.findByPk(class_id);
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });

    const currentCount = await Enrollment.count({ where: { class_id, status: 'enrolled' } });
    if (currentCount >= cls.max_students) {
      return res.status(400).json({ error: 'Lớp học đã đầy' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ where: { student_id, class_id } });
    if (existing) {
      return res.status(400).json({ error: 'Sinh viên đã đăng ký lớp học này' });
    }

    const enrollment = await Enrollment.create({ student_id, class_id });
    await createAuditLog({ userId: req.user.id, userName: req.user.full_name, action: 'CREATE', entity: 'Enrollment', entityId: enrollment.id, newValues: req.body, req });
    res.status(201).json({ message: 'Đăng ký học phần thành công', data: enrollment });
  } catch (error) { next(error); }
};

// Bulk enroll students
exports.bulkEnroll = async (req, res, next) => {
  try {
    const { class_id, student_ids } = req.body;
    const results = [];

    for (const student_id of student_ids) {
      try {
        const existing = await Enrollment.findOne({ where: { student_id, class_id } });
        if (!existing) {
          const enrollment = await Enrollment.create({ student_id, class_id });
          results.push({ student_id, status: 'enrolled', enrollment_id: enrollment.id });
        } else {
          results.push({ student_id, status: 'already_enrolled' });
        }
      } catch (err) {
        results.push({ student_id, status: 'error', message: err.message });
      }
    }

    res.status(201).json({ message: 'Đăng ký hàng loạt hoàn tất', data: results });
  } catch (error) { next(error); }
};

// Drop enrollment
exports.drop = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Không tìm thấy đăng ký' });

    enrollment.status = 'dropped';
    await enrollment.save();

    await createAuditLog({ userId: req.user.id, userName: req.user.full_name, action: 'UPDATE', entity: 'Enrollment', entityId: enrollment.id, newValues: { status: 'dropped' }, req });
    res.json({ message: 'Hủy đăng ký thành công', data: enrollment });
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Không tìm thấy đăng ký' });

    await enrollment.destroy();
    res.json({ message: 'Xóa đăng ký thành công' });
  } catch (error) { next(error); }
};

const { Appeal, Grade, User, Class, Notification } = require('../models');
const { getPagination, getPaginationData } = require('../utils/helpers');
const { createAuditLog } = require('../middleware/audit');

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.class_id) where.class_id = req.query.class_id;
    if (req.query.student_id) where.student_id = req.query.student_id;

    // Students can only see their own appeals
    if (req.user.role === 'student') where.student_id = req.user.id;

    const data = await Appeal.findAndCountAll({
      where, limit, offset,
      include: [
        { model: User, as: 'student', attributes: ['id', 'full_name', 'student_code'] },
        { model: Grade, as: 'grade' },
        { model: User, as: 'reviewer', attributes: ['id', 'full_name'] },
      ],
      order: [['created_at', 'DESC']],
    });
    const result = getPaginationData(data, page, limit);
    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const appeal = await Appeal.findByPk(req.params.id, {
      include: [
        { model: User, as: 'student' },
        { model: Grade, as: 'grade' },
        { model: User, as: 'reviewer', attributes: ['id', 'full_name'] },
      ],
    });
    if (!appeal) return res.status(404).json({ error: 'Không tìm thấy đơn phúc khảo' });

    // Students can only view their own
    if (req.user.role === 'student' && appeal.student_id !== req.user.id) {
      return res.status(403).json({ error: 'Không có quyền xem đơn này' });
    }

    res.json({ data: appeal });
  } catch (error) { next(error); }
};

// Student creates appeal
exports.create = async (req, res, next) => {
  try {
    const { grade_id, class_id, reason, requested_score } = req.body;

    const grade = await Grade.findByPk(grade_id);
    if (!grade) return res.status(404).json({ error: 'Không tìm thấy điểm' });

    // Check if already has pending appeal
    const existing = await Appeal.findOne({
      where: { grade_id, student_id: req.user.id, status: ['pending', 'reviewing'] },
    });
    if (existing) {
      return res.status(400).json({ error: 'Đã có đơn phúc khảo đang chờ xử lý cho điểm này' });
    }

    const appeal = await Appeal.create({
      student_id: req.user.id,
      grade_id,
      class_id: class_id || grade.class_id,
      reason,
      current_score: grade.score,
      requested_score,
    });

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'CREATE', entity: 'Appeal', entityId: appeal.id,
      newValues: req.body, req,
    });

    res.status(201).json({ message: 'Gửi đơn phúc khảo thành công', data: appeal });
  } catch (error) { next(error); }
};

// Lecturer/Admin reviews appeal
exports.review = async (req, res, next) => {
  try {
    const appeal = await Appeal.findByPk(req.params.id, {
      include: [{ model: Grade, as: 'grade' }],
    });
    if (!appeal) return res.status(404).json({ error: 'Không tìm thấy đơn phúc khảo' });

    const { status, reviewer_comment, final_score } = req.body;
    const oldValues = appeal.toJSON();

    appeal.status = status; // 'approved' or 'rejected'
    appeal.reviewed_by = req.user.id;
    appeal.reviewed_at = new Date();
    appeal.reviewer_comment = reviewer_comment;
    appeal.final_score = final_score;
    appeal.version = appeal.version + 1;
    await appeal.save();

    // If approved, update the grade
    if (status === 'approved' && final_score !== undefined) {
      const grade = appeal.grade;
      const oldGrade = grade.toJSON();
      grade.score = final_score;
      grade.version = grade.version + 1;
      await grade.save();

      await createAuditLog({
        userId: req.user.id, userName: req.user.full_name,
        action: 'APPEAL_GRADE_UPDATE', entity: 'Grade', entityId: grade.id,
        oldValues: oldGrade, newValues: { score: final_score, appeal_id: appeal.id }, req,
      });
    }

    // Notify student
    await Notification.create({
      user_id: appeal.student_id,
      title: status === 'approved' ? 'Đơn phúc khảo được chấp nhận' : 'Đơn phúc khảo bị từ chối',
      message: `Đơn phúc khảo #${appeal.id} đã được ${status === 'approved' ? 'chấp nhận' : 'từ chối'}. ${reviewer_comment || ''}`,
      type: status === 'approved' ? 'success' : 'info',
      link: `/appeals/${appeal.id}`,
    });

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'REVIEW_APPEAL', entity: 'Appeal', entityId: appeal.id,
      oldValues, newValues: req.body, req,
    });

    res.json({ message: 'Xử lý đơn phúc khảo thành công', data: appeal });
  } catch (error) { next(error); }
};

const { Class, Subject, User, Enrollment, Schedule } = require('../models');
const { getPagination, getPaginationData, buildWhereClause, buildOrder } = require('../utils/helpers');
const { createAuditLog } = require('../middleware/audit');

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = buildWhereClause(req.query, ['name', 'code', 'room'], ['status', 'academic_year', 'semester', 'subject_id', 'lecturer_id']);
    const order = buildOrder(req.query);

    const data = await Class.findAndCountAll({
      where, limit, offset, order,
      include: [
        { model: Subject, as: 'subject', attributes: ['id', 'name', 'code', 'credits'] },
        { model: User, as: 'lecturer', attributes: ['id', 'full_name', 'lecturer_code', 'email'] },
      ],
    });
    const result = getPaginationData(data, page, limit);
    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id, {
      include: [
        { model: Subject, as: 'subject' },
        { model: User, as: 'lecturer', attributes: ['id', 'full_name', 'lecturer_code', 'email'] },
        { model: Schedule, as: 'schedules' },
        { model: Enrollment, as: 'enrollments', include: [{ model: User, as: 'student', attributes: ['id', 'full_name', 'student_code', 'email'] }] },
      ],
    });
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });
    res.json({ data: cls });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const cls = await Class.create(req.body);
    await createAuditLog({ userId: req.user.id, userName: req.user.full_name, action: 'CREATE', entity: 'Class', entityId: cls.id, newValues: req.body, req });
    res.status(201).json({ message: 'Tạo lớp học thành công', data: cls });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });

    const oldValues = cls.toJSON();
    await cls.update(req.body);
    await createAuditLog({ userId: req.user.id, userName: req.user.full_name, action: 'UPDATE', entity: 'Class', entityId: cls.id, oldValues, newValues: req.body, req });
    res.json({ message: 'Cập nhật lớp học thành công', data: cls });
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });

    await cls.destroy();
    await createAuditLog({ userId: req.user.id, userName: req.user.full_name, action: 'DELETE', entity: 'Class', entityId: cls.id, oldValues: cls.toJSON(), req });
    res.json({ message: 'Xóa lớp học thành công' });
  } catch (error) { next(error); }
};

// Get my classes (for lecturers)
exports.getMyClasses = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = { lecturer_id: req.user.id };
    if (req.query.status) where.status = req.query.status;
    if (req.query.academic_year) where.academic_year = req.query.academic_year;

    const data = await Class.findAndCountAll({
      where, limit, offset,
      include: [{ model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] }],
      order: [['created_at', 'DESC']],
    });
    const result = getPaginationData(data, page, limit);
    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) { next(error); }
};

// Get enrolled classes (for students)
exports.getEnrolledClasses = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);

    const data = await Enrollment.findAndCountAll({
      where: { student_id: req.user.id },
      limit, offset,
      include: [{
        model: Class, as: 'class',
        include: [
          { model: Subject, as: 'subject', attributes: ['id', 'name', 'code', 'credits'] },
          { model: User, as: 'lecturer', attributes: ['id', 'full_name'] },
        ],
      }],
      order: [['created_at', 'DESC']],
    });
    const result = getPaginationData(data, page, limit);
    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) { next(error); }
};

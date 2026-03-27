const { Subject } = require('../models');
const { getPagination, getPaginationData, buildWhereClause, buildOrder } = require('../utils/helpers');
const { createAuditLog } = require('../middleware/audit');

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = buildWhereClause(req.query, ['name', 'code', 'department'], ['is_active']);
    const order = buildOrder(req.query, 'name', 'ASC');

    const data = await Subject.findAndCountAll({ where, limit, offset, order });
    const result = getPaginationData(data, page, limit);
    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Không tìm thấy môn học' });
    res.json({ data: subject });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    await createAuditLog({ userId: req.user.id, userName: req.user.full_name, action: 'CREATE', entity: 'Subject', entityId: subject.id, newValues: req.body, req });
    res.status(201).json({ message: 'Tạo môn học thành công', data: subject });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Không tìm thấy môn học' });

    const oldValues = subject.toJSON();
    await subject.update(req.body);
    await createAuditLog({ userId: req.user.id, userName: req.user.full_name, action: 'UPDATE', entity: 'Subject', entityId: subject.id, oldValues, newValues: req.body, req });
    res.json({ message: 'Cập nhật môn học thành công', data: subject });
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Không tìm thấy môn học' });

    await subject.destroy();
    await createAuditLog({ userId: req.user.id, userName: req.user.full_name, action: 'DELETE', entity: 'Subject', entityId: subject.id, oldValues: subject.toJSON(), req });
    res.json({ message: 'Xóa môn học thành công' });
  } catch (error) { next(error); }
};

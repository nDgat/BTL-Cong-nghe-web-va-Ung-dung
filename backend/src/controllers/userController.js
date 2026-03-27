const { User } = require('../models');
const { getPagination, getPaginationData, buildWhereClause, buildOrder } = require('../utils/helpers');
const { createAuditLog } = require('../middleware/audit');

// Get all users (admin only)
exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = buildWhereClause(req.query, ['full_name', 'email', 'username', 'student_code'], ['role', 'is_active']);
    const order = buildOrder(req.query);

    const data = await User.findAndCountAll({ where, limit, offset, order });
    const result = getPaginationData(data, page, limit);

    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

// Create user (admin only)
exports.create = async (req, res, next) => {
  try {
    const { username, email, password, full_name, phone, role, student_code, lecturer_code } = req.body;
    const user = await User.create({ username, email, password, full_name, phone, role, student_code, lecturer_code });

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'CREATE', entity: 'User', entityId: user.id,
      newValues: { username, email, full_name, role }, req,
    });

    res.status(201).json({ message: 'Tạo người dùng thành công', data: user });
  } catch (error) {
    next(error);
  }
};

// Update user (admin only)
exports.update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    const oldValues = user.toJSON();
    const { full_name, phone, role, is_active, student_code, lecturer_code } = req.body;

    if (full_name) user.full_name = full_name;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;
    if (is_active !== undefined) user.is_active = is_active;
    if (student_code !== undefined) user.student_code = student_code;
    if (lecturer_code !== undefined) user.lecturer_code = lecturer_code;

    await user.save();

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'UPDATE', entity: 'User', entityId: user.id,
      oldValues, newValues: req.body, req,
    });

    res.json({ message: 'Cập nhật người dùng thành công', data: user });
  } catch (error) {
    next(error);
  }
};

// Delete user (soft delete, admin only)
exports.delete = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    await user.destroy(); // soft-delete (paranoid)

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'DELETE', entity: 'User', entityId: user.id,
      oldValues: user.toJSON(), req,
    });

    res.json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    next(error);
  }
};

// Restore soft-deleted user
exports.restore = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, { paranoid: false });
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }

    await user.restore();

    res.json({ message: 'Khôi phục người dùng thành công', data: user });
  } catch (error) {
    next(error);
  }
};

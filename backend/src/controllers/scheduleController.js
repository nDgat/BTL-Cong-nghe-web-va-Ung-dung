const { Schedule, Class, Subject, User } = require('../models');
const { getPagination, getPaginationData, buildOrder } = require('../utils/helpers');
const { createAuditLog } = require('../middleware/audit');

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = {};
    if (req.query.class_id) where.class_id = req.query.class_id;
    if (req.query.day_of_week) where.day_of_week = req.query.day_of_week;
    if (req.query.type) where.type = req.query.type;

    const data = await Schedule.findAndCountAll({
      where, limit, offset,
      include: [{
        model: Class, as: 'class',
        include: [
          { model: Subject, as: 'subject', attributes: ['id', 'name', 'code'] },
          { model: User, as: 'lecturer', attributes: ['id', 'full_name'] },
        ],
      }],
      order: [['session_date', 'ASC'], ['start_time', 'ASC']],
    });
    const result = getPaginationData(data, page, limit);
    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id, {
      include: [{ model: Class, as: 'class', include: [{ model: Subject, as: 'subject' }] }],
    });
    if (!schedule) return res.status(404).json({ error: 'Không tìm thấy lịch học' });
    res.json({ data: schedule });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const schedule = await Schedule.create(req.body);
    await createAuditLog({ userId: req.user.id, userName: req.user.full_name, action: 'CREATE', entity: 'Schedule', entityId: schedule.id, newValues: req.body, req });
    res.status(201).json({ message: 'Tạo lịch học thành công', data: schedule });
  } catch (error) { next(error); }
};

exports.bulkCreate = async (req, res, next) => {
  try {
    const { schedules } = req.body;
    const created = await Schedule.bulkCreate(schedules);
    res.status(201).json({ message: `Tạo ${created.length} lịch học thành công`, data: created });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Không tìm thấy lịch học' });

    const oldValues = schedule.toJSON();
    await schedule.update(req.body);
    await createAuditLog({ userId: req.user.id, userName: req.user.full_name, action: 'UPDATE', entity: 'Schedule', entityId: schedule.id, oldValues, newValues: req.body, req });
    res.json({ message: 'Cập nhật lịch học thành công', data: schedule });
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Không tìm thấy lịch học' });

    await schedule.destroy();
    res.json({ message: 'Xóa lịch học thành công' });
  } catch (error) { next(error); }
};

// Get schedules by class
exports.getByClass = async (req, res, next) => {
  try {
    const schedules = await Schedule.findAll({
      where: { class_id: req.params.classId },
      order: [['session_date', 'ASC'], ['start_time', 'ASC']],
    });
    res.json({ data: schedules });
  } catch (error) { next(error); }
};

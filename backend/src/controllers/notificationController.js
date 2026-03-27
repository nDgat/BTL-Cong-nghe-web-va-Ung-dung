const { Notification } = require('../models');
const { getPagination, getPaginationData } = require('../utils/helpers');

// Get notifications for current user
exports.getMyNotifications = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = { user_id: req.user.id };
    if (req.query.is_read !== undefined) where.is_read = req.query.is_read === 'true';
    if (req.query.type) where.type = req.query.type;

    const data = await Notification.findAndCountAll({
      where, limit, offset,
      order: [['created_at', 'DESC']],
    });
    const result = getPaginationData(data, page, limit);

    const unreadCount = await Notification.count({ where: { user_id: req.user.id, is_read: false } });

    res.json({ data: result.items, pagination: result.pagination, unreadCount });
  } catch (error) { next(error); }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!notification) return res.status(404).json({ error: 'Không tìm thấy thông báo' });

    notification.is_read = true;
    notification.read_at = new Date();
    await notification.save();

    res.json({ message: 'Đã đánh dấu đã đọc', data: notification });
  } catch (error) { next(error); }
};

// Mark all as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { is_read: true, read_at: new Date() },
      { where: { user_id: req.user.id, is_read: false } }
    );
    res.json({ message: 'Đã đánh dấu tất cả đã đọc' });
  } catch (error) { next(error); }
};

// Delete notification
exports.delete = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!notification) return res.status(404).json({ error: 'Không tìm thấy thông báo' });

    await notification.destroy();
    res.json({ message: 'Xóa thông báo thành công' });
  } catch (error) { next(error); }
};

// Send notification (admin/system)
exports.send = async (req, res, next) => {
  try {
    const { user_id, title, message, type, link } = req.body;
    const notification = await Notification.create({ user_id, title, message, type, link });
    res.status(201).json({ message: 'Gửi thông báo thành công', data: notification });
  } catch (error) { next(error); }
};

// Send bulk notification
exports.sendBulk = async (req, res, next) => {
  try {
    const { user_ids, title, message, type, link } = req.body;
    const notifications = user_ids.map(user_id => ({ user_id, title, message, type, link }));
    const created = await Notification.bulkCreate(notifications);
    res.status(201).json({ message: `Gửi ${created.length} thông báo thành công`, data: created });
  } catch (error) { next(error); }
};

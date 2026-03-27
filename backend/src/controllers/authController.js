const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { createAuditLog } = require('../middleware/audit');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// Register
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, full_name, phone, role, student_code, lecturer_code } = req.body;

    // Only admin can create non-student accounts
    const allowedRole = (req.user && req.user.role === 'admin') ? role : 'student';

    const user = await User.create({
      username,
      email,
      password,
      full_name,
      phone,
      role: allowedRole || 'student',
      student_code,
      lecturer_code,
    });

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await createAuditLog({
      userId: user.id,
      userName: user.full_name,
      action: 'REGISTER',
      entity: 'User',
      entityId: user.id,
      newValues: { username, email, full_name, role: allowedRole },
      req,
    });

    res.status(201).json({
      message: 'Đăng ký thành công',
      data: {
        user: user.toJSON(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Tài khoản đã bị vô hiệu hóa' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // Update last login
    user.last_login = new Date();
    await user.save({ hooks: false });

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await createAuditLog({
      userId: user.id,
      userName: user.full_name,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      req,
    });

    res.json({
      message: 'Đăng nhập thành công',
      data: {
        user: user.toJSON(),
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    res.json({
      data: req.user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone, avatar } = req.body;
    const user = req.user;

    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Cập nhật thông tin thành công',
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới' });
    }

    const user = await User.findByPk(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });
    }

    user.password = newPassword;
    await user.save();

    await createAuditLog({
      userId: user.id,
      userName: user.full_name,
      action: 'CHANGE_PASSWORD',
      entity: 'User',
      entityId: user.id,
      req,
    });

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    next(error);
  }
};

// Forgot password - send reset token
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy tài khoản với email này' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.reset_password_token = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.reset_password_expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save({ hooks: false });

    // In production, send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    res.json({
      message: 'Đã gửi link đặt lại mật khẩu qua email',
      data: process.env.NODE_ENV === 'development' ? { resetToken, resetUrl } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// Reset password with token
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      where: {
        reset_password_token: hashedToken,
      },
    });

    if (!user || !user.reset_password_expires || user.reset_password_expires < new Date()) {
      return res.status(400).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    user.password = password;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    await createAuditLog({
      userId: user.id,
      userName: user.full_name,
      action: 'RESET_PASSWORD',
      entity: 'User',
      entityId: user.id,
      req,
    });

    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    next(error);
  }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.json({
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
};

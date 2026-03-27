const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./models');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const swaggerSpec = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Security Middleware =====
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting — chỉ bật khi production
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút' },
  });
  app.use('/api/', limiter);

  // Auth rate limit - stricter
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Quá nhiều lần thử đăng nhập, vui lòng thử lại sau' },
  });
  app.use('/api/auth/login', authLimiter);
}

// ===== Body Parsing =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== Logging =====
app.use(morgan('combined'));

// ===== Static files =====
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===== Swagger API Docs =====
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Quản lý Đào tạo',
}));

// ===== API Routes =====
app.use('/api', routes);

// ===== Root endpoint =====
app.get('/', (req, res) => {
  res.json({
    message: 'Hệ thống Quản lý Đào tạo & Điểm danh Sinh viên',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/health',
  });
});

// ===== Error Handler =====
app.use(errorHandler);

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ error: 'Route không tồn tại' });
});

// ===== Start Server =====
const startServer = async () => {
  try {
    // Sync database
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synced successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Only start listening when running the entry file directly.
// This prevents Jest importing the app from hanging on DB sync / open server.
if (require.main === module) startServer();

module.exports = app;

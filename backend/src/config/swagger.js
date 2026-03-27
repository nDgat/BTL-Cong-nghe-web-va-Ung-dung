const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quản lý Đào tạo & Điểm danh Sinh viên API',
      version: '1.0.0',
      description: 'API quản lý đào tạo, lớp học, lịch học, điểm danh, điểm số, cảnh báo chuyên cần',
      contact: {
        name: 'Admin',
        email: 'admin@university.edu.vn',
      },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Xác thực & phân quyền' },
      { name: 'Users', description: 'Quản lý người dùng' },
      { name: 'Subjects', description: 'Quản lý môn học' },
      { name: 'Classes', description: 'Quản lý lớp học' },
      { name: 'Schedules', description: 'Quản lý lịch học' },
      { name: 'Enrollments', description: 'Đăng ký học phần' },
      { name: 'Attendances', description: 'Điểm danh' },
      { name: 'Grades', description: 'Quản lý điểm' },
      { name: 'Appeals', description: 'Phúc khảo' },
      { name: 'Notifications', description: 'Thông báo' },
      { name: 'Reports', description: 'Báo cáo & thống kê' },
      { name: 'Export', description: 'Xuất/Nhập dữ liệu' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

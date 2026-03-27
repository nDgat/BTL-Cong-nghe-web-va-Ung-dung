# 📚 Hệ thống Quản lý Đào tạo & Điểm danh Sinh viên

## Mô tả
Hệ thống quản lý đào tạo toàn diện bao gồm: quản lý lớp học, lịch học, điểm danh, điểm số, cảnh báo chuyên cần, phúc khảo và báo cáo thống kê.

## 🏗️ Kiến trúc

```
├── backend/          # Node.js + Express + SQL Server (Sequelize ORM)
├── frontend/         # React.js + Ant Design + Chart.js
├── database/         # SQL Server schema & seed data scripts
└── docker-compose.yml
```

## 👥 Vai trò
| Vai trò | Mô tả |
|---------|--------|
| **Admin** | Quản trị toàn hệ thống, CRUD tất cả entity, quản lý người dùng |
| **Giảng viên** | Quản lý lớp dạy, điểm danh, nhập điểm, duyệt phúc khảo |
| **Cố vấn** | Xem báo cáo chuyên cần, kiểm tra cảnh báo |
| **Sinh viên** | Xem lịch học, điểm số, gửi phúc khảo |

## ✨ Chức năng chính

### 1. Xác thực & Phân quyền
- Đăng ký/Đăng nhập với JWT
- RBAC: 4 vai trò (Admin, Giảng viên, Cố vấn, Sinh viên)
- Đổi mật khẩu, quên mật khẩu

### 2. Quản lý Danh mục
- CRUD Môn học, Lớp học, Niên khóa
- Tìm kiếm, lọc, sắp xếp, phân trang
- Đăng ký học phần

### 3. Lịch học & Điểm danh
- Lịch học/thi theo buổi
- Điểm danh theo buổi (web)
- Cảnh báo vắng > x%
- Gửi email thông báo

### 4. Điểm số
- Nhập điểm thành phần (midterm, final, assignment)
- Công thức tính điểm cuối kỳ (cấu hình)
- Bảng điểm cá nhân

### 5. Phúc khảo
- Workflow: Sinh viên gửi → Giảng viên duyệt
- Trạng thái: pending → reviewing → approved/rejected
- Thông báo kết quả

### 6. Báo cáo
- Dashboard thống kê
- Phân phối điểm, tỷ lệ qua môn
- Báo cáo chuyên cần
- Biểu đồ Chart.js

### 7. Xuất/Nhập dữ liệu
- Xuất điểm Excel/CSV
- Xuất bảng điểm PDF
- Xuất điểm danh Excel
- Import danh sách SV từ Excel

### 8. Audit & Bảo mật
- Audit log (ai làm gì, lúc nào)
- Soft-delete, versioning cho bản ghi nhạy cảm
- Rate limiting, CORS, Helmet
- Kiểm soát quyền sửa điểm

## 🗃️ Database (ERD)

```
Users ─────┬──── Classes ──── Subjects
           │         │
           │    Schedules
           │         │
     Enrollments ────┤
           │         │
        Grades    Attendances
           │
        Appeals
           
Notifications    AuditLogs
```

**Bảng dữ liệu:** users, subjects, classes, schedules, enrollments, attendances, grades, appeals, notifications, audit_logs

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js >= 18
- npm >= 9
- SQL Server 2019+ (hoặc SQL Server Express)

### Cài đặt Database (SQL Server)

```bash
# 1. Tạo database và bảng
sqlcmd -S localhost -U sa -P YourPassword@123 -i database/schema.sql

# 2. Chèn dữ liệu mẫu (2000+ bản ghi)
sqlcmd -S localhost -U sa -P YourPassword@123 -i database/seed_data.sql
```

> **Lưu ý:** Cập nhật thông tin kết nối SQL Server trong file `backend/.env`

### Backend

```bash
cd backend
npm install
# Nếu dùng Sequelize seed (thay vì SQL file):
npm run seed    # Tạo dữ liệu mẫu qua Sequelize ORM
npm run dev     # Chạy development server (port 5000)
```

### Frontend

```bash
cd frontend
npm install
npm start       # Chạy React dev server (port 3000)
```

### Docker

```bash
docker-compose up --build
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

## 📋 Tài khoản Demo

| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| Admin | admin@university.edu.vn | Admin@123 |
| Giảng viên | lecturer1@university.edu.vn | Lecturer@123 |
| Cố vấn | advisor1@university.edu.vn | Lecturer@123 |
| Sinh viên | student1@student.edu.vn | Student@123 |

## 📚 API Documentation

- **Swagger UI:** http://localhost:5000/api-docs
- **Health Check:** http://localhost:5000/api/health

### API Endpoints chính

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký |
| GET | `/api/subjects` | Danh sách môn học |
| GET | `/api/classes` | Danh sách lớp học |
| GET | `/api/schedules/class/:id` | Lịch học theo lớp |
| POST | `/api/attendances/take` | Điểm danh |
| POST | `/api/grades/input` | Nhập điểm |
| GET | `/api/grades/transcript/:id` | Bảng điểm |
| POST | `/api/appeals` | Gửi phúc khảo |
| GET | `/api/reports/dashboard` | Dashboard |
| GET | `/api/export/grades/:id/excel` | Xuất điểm Excel |

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** SQL Server + Sequelize ORM (tedious driver)
- **Auth:** JWT (jsonwebtoken)
- **API Docs:** Swagger (swagger-jsdoc + swagger-ui-express)
- **Export:** ExcelJS, PDFKit
- **Security:** Helmet, CORS, Rate Limiting

### Frontend
- **Framework:** React 18
- **UI Library:** Ant Design 5
- **Charts:** Chart.js + react-chartjs-2
- **HTTP Client:** Axios
- **Routing:** React Router 6
- **State:** React Context API

## 📊 Seed Data
Hệ thống tự tạo **2000+ bản ghi** mẫu:
- 219 users (1 admin, 3 cố vấn, 15 giảng viên, 200 sinh viên)
- 20 môn học
- 40 lớp học
- 600 lịch học
- ~1000 đăng ký
- ~10,000+ điểm danh
- ~3,000 điểm
- 50 thông báo

## 📝 License
ISC

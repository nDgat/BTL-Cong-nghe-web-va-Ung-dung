-- =====================================================
-- SQL Server Schema: Quản lý Đào tạo & Điểm danh SV
-- Database: training_management
-- =====================================================

-- Tạo database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'training_management')
BEGIN
    CREATE DATABASE training_management;
END
GO

USE training_management;
GO

-- =====================================================
-- Xóa bảng cũ nếu tồn tại (theo thứ tự dependency)
-- =====================================================
IF OBJECT_ID('audit_logs', 'U') IS NOT NULL DROP TABLE audit_logs;
IF OBJECT_ID('notifications', 'U') IS NOT NULL DROP TABLE notifications;
IF OBJECT_ID('appeals', 'U') IS NOT NULL DROP TABLE appeals;
IF OBJECT_ID('grades', 'U') IS NOT NULL DROP TABLE grades;
IF OBJECT_ID('attendances', 'U') IS NOT NULL DROP TABLE attendances;
IF OBJECT_ID('enrollments', 'U') IS NOT NULL DROP TABLE enrollments;
IF OBJECT_ID('schedules', 'U') IS NOT NULL DROP TABLE schedules;
IF OBJECT_ID('classes', 'U') IS NOT NULL DROP TABLE classes;
IF OBJECT_ID('subjects', 'U') IS NOT NULL DROP TABLE subjects;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;
GO

-- =====================================================
-- 1. BẢNG USERS (Người dùng)
-- =====================================================
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'lecturer', 'advisor', 'student')),
    phone NVARCHAR(20) NULL,
    avatar NVARCHAR(255) NULL,
    student_code NVARCHAR(20) NULL,
    lecturer_code NVARCHAR(20) NULL,
    department NVARCHAR(100) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    last_login DATETIME2 NULL,
    reset_password_token NVARCHAR(255) NULL,
    reset_password_expires DATETIME2 NULL,
    version INT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL
);
GO

-- Filtered unique indexes (chỉ unique khi NOT NULL)
CREATE UNIQUE INDEX idx_users_student_code ON users(student_code) WHERE student_code IS NOT NULL;
CREATE UNIQUE INDEX idx_users_lecturer_code ON users(lecturer_code) WHERE lecturer_code IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
GO

-- =====================================================
-- 2. BẢNG SUBJECTS (Môn học)
-- =====================================================
CREATE TABLE subjects (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(20) NOT NULL UNIQUE,
    name NVARCHAR(200) NOT NULL,
    credits INT NOT NULL DEFAULT 3 CHECK (credits >= 1 AND credits <= 10),
    description NVARCHAR(MAX) NULL,
    department NVARCHAR(100) NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    version INT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL
);
GO

CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_subjects_deleted_at ON subjects(deleted_at);
GO

-- =====================================================
-- 3. BẢNG CLASSES (Lớp học)
-- =====================================================
CREATE TABLE classes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(30) NOT NULL UNIQUE,
    name NVARCHAR(200) NOT NULL,
    subject_id INT NOT NULL,
    lecturer_id INT NULL,
    academic_year NVARCHAR(20) NOT NULL DEFAULT '2024-2025',
    semester INT NOT NULL DEFAULT 1 CHECK (semester IN (1, 2, 3)),
    room NVARCHAR(50) NULL,
    schedule_desc NVARCHAR(200) NULL,
    max_students INT NOT NULL DEFAULT 50,
    status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    start_date DATE NULL,
    end_date DATE NULL,
    grade_formula NVARCHAR(MAX) NULL DEFAULT '{"midterm":0.3,"final":0.5,"assignment":0.2}',
    version INT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    CONSTRAINT fk_classes_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
    CONSTRAINT fk_classes_lecturer FOREIGN KEY (lecturer_id) REFERENCES users(id)
);
GO

CREATE INDEX idx_classes_subject ON classes(subject_id);
CREATE INDEX idx_classes_lecturer ON classes(lecturer_id);
CREATE INDEX idx_classes_academic_year ON classes(academic_year);
CREATE INDEX idx_classes_deleted_at ON classes(deleted_at);
GO

-- =====================================================
-- 4. BẢNG SCHEDULES (Lịch học)
-- =====================================================
CREATE TABLE schedules (
    id INT IDENTITY(1,1) PRIMARY KEY,
    class_id INT NOT NULL,
    session_number INT NOT NULL,
    session_date DATE NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time NVARCHAR(10) NOT NULL DEFAULT '07:30',
    end_time NVARCHAR(10) NOT NULL DEFAULT '09:30',
    room NVARCHAR(50) NULL,
    type NVARCHAR(20) NOT NULL DEFAULT 'lecture' CHECK (type IN ('lecture', 'lab', 'exam', 'review')),
    topic NVARCHAR(200) NULL,
    is_cancelled BIT NOT NULL DEFAULT 0,
    notes NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    CONSTRAINT fk_schedules_class FOREIGN KEY (class_id) REFERENCES classes(id)
);
GO

CREATE INDEX idx_schedules_class ON schedules(class_id);
CREATE INDEX idx_schedules_date ON schedules(session_date);
CREATE INDEX idx_schedules_deleted_at ON schedules(deleted_at);
GO

-- =====================================================
-- 5. BẢNG ENROLLMENTS (Đăng ký học phần)
-- =====================================================
CREATE TABLE enrollments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed', 'failed')),
    enrolled_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    dropped_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_enrollments_class FOREIGN KEY (class_id) REFERENCES classes(id),
    CONSTRAINT uq_enrollment UNIQUE (student_id, class_id)
);
GO

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_deleted_at ON enrollments(deleted_at);
GO

-- =====================================================
-- 6. BẢNG ATTENDANCES (Điểm danh)
-- =====================================================
CREATE TABLE attendances (
    id INT IDENTITY(1,1) PRIMARY KEY,
    schedule_id INT NOT NULL,
    student_id INT NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'late', 'excused')),
    check_in_time DATETIME2 NULL,
    notes NVARCHAR(200) NULL,
    recorded_by INT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    CONSTRAINT fk_attendances_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(id),
    CONSTRAINT fk_attendances_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_attendances_recorded FOREIGN KEY (recorded_by) REFERENCES users(id),
    CONSTRAINT uq_attendance UNIQUE (schedule_id, student_id)
);
GO

CREATE INDEX idx_attendances_schedule ON attendances(schedule_id);
CREATE INDEX idx_attendances_student ON attendances(student_id);
CREATE INDEX idx_attendances_status ON attendances(status);
CREATE INDEX idx_attendances_deleted_at ON attendances(deleted_at);
GO

-- =====================================================
-- 7. BẢNG GRADES (Điểm)
-- =====================================================
CREATE TABLE grades (
    id INT IDENTITY(1,1) PRIMARY KEY,
    enrollment_id INT NOT NULL,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    midterm_score DECIMAL(4,1) NULL CHECK (midterm_score >= 0 AND midterm_score <= 10),
    final_score DECIMAL(4,1) NULL CHECK (final_score >= 0 AND final_score <= 10),
    assignment_score DECIMAL(4,1) NULL CHECK (assignment_score >= 0 AND assignment_score <= 10),
    final_grade DECIMAL(4,2) NULL,
    letter_grade NVARCHAR(5) NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'graded', 'finalized')),
    graded_by INT NULL,
    graded_at DATETIME2 NULL,
    version INT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    CONSTRAINT fk_grades_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id),
    CONSTRAINT fk_grades_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_grades_class FOREIGN KEY (class_id) REFERENCES classes(id),
    CONSTRAINT fk_grades_graded_by FOREIGN KEY (graded_by) REFERENCES users(id)
);
GO

CREATE INDEX idx_grades_enrollment ON grades(enrollment_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_class ON grades(class_id);
CREATE INDEX idx_grades_deleted_at ON grades(deleted_at);
GO

-- =====================================================
-- 8. BẢNG APPEALS (Phúc khảo)
-- =====================================================
CREATE TABLE appeals (
    id INT IDENTITY(1,1) PRIMARY KEY,
    grade_id INT NOT NULL,
    student_id INT NOT NULL,
    reason NVARCHAR(MAX) NOT NULL,
    current_score DECIMAL(4,1) NULL,
    requested_score DECIMAL(4,1) NULL,
    final_score DECIMAL(4,1) NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
    reviewer_id INT NULL,
    reviewer_comment NVARCHAR(MAX) NULL,
    reviewed_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    CONSTRAINT fk_appeals_grade FOREIGN KEY (grade_id) REFERENCES grades(id),
    CONSTRAINT fk_appeals_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_appeals_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id)
);
GO

CREATE INDEX idx_appeals_grade ON appeals(grade_id);
CREATE INDEX idx_appeals_student ON appeals(student_id);
CREATE INDEX idx_appeals_status ON appeals(status);
CREATE INDEX idx_appeals_deleted_at ON appeals(deleted_at);
GO

-- =====================================================
-- 9. BẢNG NOTIFICATIONS (Thông báo)
-- =====================================================
CREATE TABLE notifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    title NVARCHAR(200) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    type NVARCHAR(30) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'grade', 'attendance')),
    is_read BIT NOT NULL DEFAULT 0,
    read_at DATETIME2 NULL,
    metadata NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_deleted_at ON notifications(deleted_at);
GO

-- =====================================================
-- 10. BẢNG AUDIT_LOGS (Nhật ký)
-- =====================================================
CREATE TABLE audit_logs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    action NVARCHAR(50) NOT NULL,
    entity NVARCHAR(50) NOT NULL,
    entity_id INT NULL,
    old_values NVARCHAR(MAX) NULL,
    new_values NVARCHAR(MAX) NULL,
    ip_address NVARCHAR(45) NULL,
    user_agent NVARCHAR(500) NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    deleted_at DATETIME2 NULL,
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
GO

PRINT N'✅ Schema created successfully! (10 tables)';
GO

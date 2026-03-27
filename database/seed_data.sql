-- =====================================================
-- Seed Data: Quản lý Đào tạo & Điểm danh SV
-- SQL Server - 2000+ bản ghi dữ liệu mẫu
-- =====================================================
-- HƯỚNG DẪN: Chạy schema.sql TRƯỚC, sau đó chạy file này
-- Mật khẩu chung: password (bcrypt hash)
-- =====================================================

USE training_management;
GO

-- =====================================================
-- 1. USERS - Admin (id=1)
-- =====================================================
INSERT INTO users (username, email, password, full_name, role, phone, department) VALUES
('admin', 'admin@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'Quản trị viên', 'admin', '0900000001', N'Phòng Đào tạo');
GO

-- =====================================================
-- 1b. USERS - Giảng viên (id=2 đến id=16)
-- =====================================================
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_nguyen_van_a', 'nguyenvana@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'PGS.TS Nguyễn Văn A', 'lecturer', '0900000010', 'GV001', N'Khoa CNTT');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_tran_thi_b', 'tranthib@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'TS. Trần Thị B', 'lecturer', '0900000011', 'GV002', N'Khoa CNTT');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_le_van_c', 'levanc@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'ThS. Lê Văn C', 'lecturer', '0900000012', 'GV003', N'Khoa Toán');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_pham_thi_d', 'phamthid@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'TS. Phạm Thị D', 'lecturer', '0900000013', 'GV004', N'Khoa Kinh tế');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_hoang_van_e', 'hoangvane@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'PGS.TS Hoàng Văn E', 'lecturer', '0900000014', 'GV005', N'Khoa CNTT');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_vu_thi_f', 'vuthif@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'TS. Vũ Thị F', 'lecturer', '0900000015', 'GV006', N'Khoa Ngoại ngữ');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_do_van_g', 'dovang@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'ThS. Đỗ Văn G', 'lecturer', '0900000016', 'GV007', N'Khoa Điện tử');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_bui_thi_h', 'buithih@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'TS. Bùi Thị H', 'lecturer', '0900000017', 'GV008', N'Khoa CNTT');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_ngo_van_i', 'ngovani@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'PGS.TS Ngô Văn I', 'lecturer', '0900000018', 'GV009', N'Khoa Toán');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_duong_thi_k', 'duongthik@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'TS. Dương Thị K', 'lecturer', '0900000019', 'GV010', N'Khoa Kinh tế');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_ly_van_l', 'lyvanl@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'ThS. Lý Văn L', 'lecturer', '0900000020', 'GV011', N'Khoa CNTT');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_truong_thi_m', 'truongthim@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'TS. Trương Thị M', 'lecturer', '0900000021', 'GV012', N'Khoa Điện tử');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_dinh_van_n', 'dinhvann@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'PGS.TS Đinh Văn N', 'lecturer', '0900000022', 'GV013', N'Khoa CNTT');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_mai_thi_o', 'maithio@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'TS. Mai Thị O', 'lecturer', '0900000023', 'GV014', N'Khoa Ngoại ngữ');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('gv_cao_van_p', 'caovanp@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'ThS. Cao Văn P', 'lecturer', '0900000024', 'GV015', N'Khoa Toán');
GO

-- =====================================================
-- 1c. USERS - Cố vấn (id=17 đến id=19)
-- =====================================================
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('cv_nguyen_q', 'nguyenq@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'ThS. Nguyễn Văn Q', 'advisor', '0900000030', 'CV001', N'Khoa CNTT');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('cv_tran_r', 'tranr@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'ThS. Trần Thị R', 'advisor', '0900000031', 'CV002', N'Khoa Kinh tế');
INSERT INTO users (username, email, password, full_name, role, phone, lecturer_code, department) VALUES
('cv_le_s', 'les@university.edu.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', N'ThS. Lê Văn S', 'advisor', '0900000032', 'CV003', N'Khoa Toán');
GO

-- Kiểm tra users đã insert đúng
SELECT COUNT(*) AS [Users so far] FROM users; -- Phải = 19
GO

-- =====================================================
-- 1d. USERS - Sinh viên 200 người (id=20 đến id=219)
-- =====================================================
DECLARE @i INT = 1;
DECLARE @username NVARCHAR(50);
DECLARE @email NVARCHAR(100);
DECLARE @fullname NVARCHAR(100);
DECLARE @student_code NVARCHAR(20);
DECLARE @phone NVARCHAR(20);
DECLARE @dept NVARCHAR(100);
DECLARE @ho NVARCHAR(20);
DECLARE @dem NVARCHAR(20);
DECLARE @ten NVARCHAR(20);

WHILE @i <= 200
BEGIN
    SET @student_code = 'SV' + RIGHT('000' + CAST(@i AS VARCHAR), 3);
    SET @username = 'sv_' + RIGHT('000' + CAST(@i AS VARCHAR), 3);
    SET @email = 'student' + CAST(@i AS VARCHAR) + '@student.edu.vn';
    SET @phone = '09' + RIGHT('00000000' + CAST(1000000 + @i AS VARCHAR), 8);
    
    SET @ho = CASE (@i % 10) 
        WHEN 0 THEN N'Nguyễn' WHEN 1 THEN N'Trần' WHEN 2 THEN N'Lê' 
        WHEN 3 THEN N'Phạm' WHEN 4 THEN N'Hoàng' WHEN 5 THEN N'Vũ'
        WHEN 6 THEN N'Đỗ' WHEN 7 THEN N'Bùi' WHEN 8 THEN N'Ngô' ELSE N'Dương' END;
    SET @dem = CASE (@i % 5) 
        WHEN 0 THEN N'Văn' WHEN 1 THEN N'Thị' WHEN 2 THEN N'Đức' 
        WHEN 3 THEN N'Minh' ELSE N'Hoàng' END;
    SET @ten = CASE (@i % 15) 
        WHEN 0 THEN N'An' WHEN 1 THEN N'Bình' WHEN 2 THEN N'Chi' WHEN 3 THEN N'Dũng'
        WHEN 4 THEN N'Em' WHEN 5 THEN N'Giang' WHEN 6 THEN N'Hải' WHEN 7 THEN N'Khánh'
        WHEN 8 THEN N'Linh' WHEN 9 THEN N'Minh' WHEN 10 THEN N'Nam' WHEN 11 THEN N'Phúc'
        WHEN 12 THEN N'Quân' WHEN 13 THEN N'Tâm' ELSE N'Uyên' END;
    SET @fullname = @ho + N' ' + @dem + N' ' + @ten;
    SET @dept = CASE (@i % 5)
        WHEN 0 THEN N'Khoa CNTT' WHEN 1 THEN N'Khoa Toán' WHEN 2 THEN N'Khoa Kinh tế'
        WHEN 3 THEN N'Khoa Điện tử' ELSE N'Khoa Ngoại ngữ' END;
    
    INSERT INTO users (username, email, password, full_name, role, phone, student_code, department)
    VALUES (@username, @email, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', @fullname, 'student', @phone, @student_code, @dept);
    
    SET @i = @i + 1;
END

DECLARE @user_count INT = (SELECT COUNT(*) FROM users);
PRINT N'✅ Users: ' + CAST(@user_count AS NVARCHAR) + N' records';
GO

-- =====================================================
-- 2. SUBJECTS (20 môn học)
-- =====================================================
INSERT INTO subjects (code, name, credits, description, department) VALUES
('CS101', N'Nhập môn lập trình', 3, N'Học lập trình cơ bản với C/C++', N'Khoa CNTT'),
('CS102', N'Cấu trúc dữ liệu và giải thuật', 4, N'Cấu trúc dữ liệu, thuật toán sắp xếp, tìm kiếm', N'Khoa CNTT'),
('CS201', N'Cơ sở dữ liệu', 3, N'Thiết kế và quản trị CSDL quan hệ', N'Khoa CNTT'),
('CS202', N'Lập trình hướng đối tượng', 3, N'OOP với Java/C#', N'Khoa CNTT'),
('CS301', N'Công nghệ Web', 4, N'HTML, CSS, JavaScript, React, Node.js', N'Khoa CNTT'),
('CS302', N'Mạng máy tính', 3, N'Mạng LAN, WAN, TCP/IP, bảo mật mạng', N'Khoa CNTT'),
('CS303', N'Hệ điều hành', 3, N'Process, Thread, Memory, File system', N'Khoa CNTT'),
('CS401', N'Trí tuệ nhân tạo', 3, N'AI cơ bản, Machine Learning', N'Khoa CNTT'),
('CS402', N'An toàn thông tin', 3, N'Mã hóa, xác thực, bảo mật ứng dụng', N'Khoa CNTT'),
('CS403', N'Phát triển ứng dụng di động', 3, N'React Native, Flutter', N'Khoa CNTT'),
('MATH101', N'Giải tích 1', 4, N'Đạo hàm, tích phân, chuỗi', N'Khoa Toán'),
('MATH102', N'Đại số tuyến tính', 3, N'Ma trận, vector, không gian vector', N'Khoa Toán'),
('MATH201', N'Xác suất thống kê', 3, N'Xác suất, phân phối, kiểm định', N'Khoa Toán'),
('MATH301', N'Toán rời rạc', 3, N'Logic, đồ thị, tổ hợp', N'Khoa Toán'),
('ECO101', N'Kinh tế vi mô', 3, N'Cung cầu, thị trường, doanh nghiệp', N'Khoa Kinh tế'),
('ECO102', N'Kinh tế vĩ mô', 3, N'GDP, lạm phát, chính sách tiền tệ', N'Khoa Kinh tế'),
('EE201', N'Kỹ thuật điện tử', 3, N'Mạch điện tử cơ bản, vi xử lý', N'Khoa Điện tử'),
('EE301', N'Vi xử lý và vi điều khiển', 4, N'8051, ARM, lập trình nhúng', N'Khoa Điện tử'),
('ENG101', N'Tiếng Anh cơ bản', 3, N'English for beginners', N'Khoa Ngoại ngữ'),
('ENG201', N'Tiếng Anh chuyên ngành CNTT', 3, N'Technical English for IT', N'Khoa Ngoại ngữ');

DECLARE @subj_count INT = (SELECT COUNT(*) FROM subjects);
PRINT N'✅ Subjects: ' + CAST(@subj_count AS NVARCHAR) + N' records';
GO

-- =====================================================
-- 3. CLASSES (40 lớp) - HK1 (27 lớp) + HK2 (13 lớp)
-- lecturer_id: 2=GV001, 3=GV002, 4=GV003, 5=GV004, 6=GV005
--              7=GV006, 8=GV007, 9=GV008, 10=GV009, 11=GV010
--              12=GV011, 13=GV012, 14=GV013, 15=GV014, 16=GV015
-- =====================================================
-- HK1
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS101-01', N'Nhập môn lập trình - Nhóm 1', 1, 2, '2024-2025', 1, 'A101', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS101-02', N'Nhập môn lập trình - Nhóm 2', 1, 3, '2024-2025', 1, 'A102', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS102-01', N'CTDL & Giải thuật - Nhóm 1', 2, 2, '2024-2025', 1, 'A201', 45, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS102-02', N'CTDL & Giải thuật - Nhóm 2', 2, 6, '2024-2025', 1, 'A202', 45, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS201-01', N'Cơ sở dữ liệu - Nhóm 1', 3, 3, '2024-2025', 1, 'B101', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS201-02', N'Cơ sở dữ liệu - Nhóm 2', 3, 9, '2024-2025', 1, 'B102', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS202-01', N'Lập trình OOP - Nhóm 1', 4, 2, '2024-2025', 1, 'B201', 45, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS202-02', N'Lập trình OOP - Nhóm 2', 4, 12, '2024-2025', 1, 'B202', 45, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS301-01', N'Công nghệ Web - Nhóm 1', 5, 6, '2024-2025', 1, 'C101', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS301-02', N'Công nghệ Web - Nhóm 2', 5, 2, '2024-2025', 1, 'C102', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS302-01', N'Mạng máy tính - Nhóm 1', 6, 8, '2024-2025', 1, 'C201', 45, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS303-01', N'Hệ điều hành - Nhóm 1', 7, 9, '2024-2025', 1, 'C301', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS401-01', N'Trí tuệ nhân tạo - Nhóm 1', 8, 6, '2024-2025', 1, 'D101', 40, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS402-01', N'An toàn thông tin - Nhóm 1', 9, 14, '2024-2025', 1, 'D201', 40, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS403-01', N'Phát triển ƯDĐT - Nhóm 1', 10, 12, '2024-2025', 1, 'D301', 40, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('MATH101-01', N'Giải tích 1 - Nhóm 1', 11, 4, '2024-2025', 1, 'E101', 60, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('MATH101-02', N'Giải tích 1 - Nhóm 2', 11, 10, '2024-2025', 1, 'E102', 60, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('MATH102-01', N'Đại số tuyến tính - Nhóm 1', 12, 4, '2024-2025', 1, 'E201', 55, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('MATH201-01', N'Xác suất thống kê - Nhóm 1', 13, 10, '2024-2025', 1, 'E301', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('MATH301-01', N'Toán rời rạc - Nhóm 1', 14, 16, '2024-2025', 1, 'E401', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('ECO101-01', N'Kinh tế vi mô - Nhóm 1', 15, 5, '2024-2025', 1, 'F101', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('ECO102-01', N'Kinh tế vĩ mô - Nhóm 1', 16, 11, '2024-2025', 1, 'F201', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('EE201-01', N'Kỹ thuật điện tử - Nhóm 1', 17, 8, '2024-2025', 1, 'G101', 45, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('EE301-01', N'Vi xử lý - Nhóm 1', 18, 13, '2024-2025', 1, 'G201', 40, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('ENG101-01', N'Tiếng Anh CB - Nhóm 1', 19, 7, '2024-2025', 1, 'H101', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('ENG101-02', N'Tiếng Anh CB - Nhóm 2', 19, 15, '2024-2025', 1, 'H102', 50, 'active', '2024-09-02', '2025-01-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('ENG201-01', N'TA chuyên ngành CNTT - Nhóm 1', 20, 7, '2024-2025', 1, 'H201', 40, 'active', '2024-09-02', '2025-01-15');
-- HK2
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS101-03', N'Nhập môn lập trình - Nhóm 3', 1, 3, '2024-2025', 2, 'A101', 50, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS201-03', N'Cơ sở dữ liệu - Nhóm 3', 3, 2, '2024-2025', 2, 'B101', 50, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS301-03', N'Công nghệ Web - Nhóm 3', 5, 6, '2024-2025', 2, 'C101', 50, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS302-02', N'Mạng máy tính - Nhóm 2', 6, 8, '2024-2025', 2, 'C201', 45, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS401-02', N'Trí tuệ nhân tạo - Nhóm 2', 8, 14, '2024-2025', 2, 'D101', 40, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('MATH101-03', N'Giải tích 1 - Nhóm 3', 11, 10, '2024-2025', 2, 'E101', 60, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('MATH102-02', N'Đại số tuyến tính - Nhóm 2', 12, 16, '2024-2025', 2, 'E201', 55, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('ECO101-02', N'Kinh tế vi mô - Nhóm 2', 15, 11, '2024-2025', 2, 'F101', 50, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('EE201-02', N'Kỹ thuật điện tử - Nhóm 2', 17, 13, '2024-2025', 2, 'G101', 45, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('ENG101-03', N'Tiếng Anh CB - Nhóm 3', 19, 15, '2024-2025', 2, 'H101', 50, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS202-03', N'Lập trình OOP - Nhóm 3', 4, 9, '2024-2025', 2, 'B201', 45, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('CS303-02', N'Hệ điều hành - Nhóm 2', 7, 12, '2024-2025', 2, 'C301', 50, 'active', '2025-02-10', '2025-06-15');
INSERT INTO classes (code, name, subject_id, lecturer_id, academic_year, semester, room, max_students, status, start_date, end_date) VALUES
('MATH201-02', N'Xác suất thống kê - Nhóm 2', 13, 4, '2024-2025', 2, 'E301', 50, 'active', '2025-02-10', '2025-06-15');

DECLARE @class_count INT = (SELECT COUNT(*) FROM classes);
PRINT N'✅ Classes: ' + CAST(@class_count AS NVARCHAR) + N' records';
GO

-- =====================================================
-- 4. SCHEDULES (600 buổi - 15 buổi/lớp x 40 lớp)
-- =====================================================
DECLARE @class_id INT = 1;
DECLARE @session INT;
DECLARE @base_date DATE;
DECLARE @session_date DATE;
DECLARE @day_of_week INT;
DECLARE @start_time NVARCHAR(10);
DECLARE @end_time NVARCHAR(10);
DECLARE @room NVARCHAR(50);
DECLARE @topic NVARCHAR(200);

WHILE @class_id <= 40
BEGIN
    SET @session = 1;
    IF @class_id <= 27
        SET @base_date = '2024-09-02';
    ELSE
        SET @base_date = '2025-02-10';
    
    SET @start_time = CASE (@class_id % 4) WHEN 0 THEN '07:30' WHEN 1 THEN '09:30' WHEN 2 THEN '13:30' ELSE '15:30' END;
    SET @end_time = CASE (@class_id % 4) WHEN 0 THEN '09:30' WHEN 1 THEN '11:30' WHEN 2 THEN '15:30' ELSE '17:30' END;
    SET @day_of_week = (@class_id % 5) + 1;
    SELECT @room = room FROM classes WHERE id = @class_id;
    
    WHILE @session <= 15
    BEGIN
        SET @session_date = DATEADD(WEEK, @session - 1, @base_date);
        SET @session_date = DATEADD(DAY, @day_of_week - DATEPART(WEEKDAY, @session_date) + 1, @session_date);
        SET @topic = N'Buổi ' + CAST(@session AS NVARCHAR) + N' - Nội dung ' + CAST(@session AS NVARCHAR);
        
        INSERT INTO schedules (class_id, session_number, session_date, day_of_week, start_time, end_time, room, type, topic)
        VALUES (@class_id, @session, @session_date, @day_of_week, @start_time, @end_time, @room, 
            CASE WHEN @session = 15 THEN 'exam' WHEN @session = 14 THEN 'review' ELSE 'lecture' END, @topic);
        
        SET @session = @session + 1;
    END
    SET @class_id = @class_id + 1;
END

DECLARE @sched_count INT = (SELECT COUNT(*) FROM schedules);
PRINT N'✅ Schedules: ' + CAST(@sched_count AS NVARCHAR) + N' records';
GO

-- =====================================================
-- 5. ENROLLMENTS - Dùng query lấy student_id thực tế
-- Mỗi SV đăng ký 5 lớp (tổng ~1000 enrollments)
-- =====================================================
DECLARE @sv_id INT;
DECLARE @sv_row INT = 0;
DECLARE @cls_offset INT;
DECLARE @total_classes INT = 27; -- HK1 classes

DECLARE sv_cursor CURSOR FOR
    SELECT id FROM users WHERE role = 'student' ORDER BY id;

OPEN sv_cursor;
FETCH NEXT FROM sv_cursor INTO @sv_id;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @cls_offset = (@sv_row % @total_classes);
    
    BEGIN TRY INSERT INTO enrollments (student_id, class_id, status) VALUES (@sv_id, (@cls_offset % @total_classes) + 1, 'active'); END TRY BEGIN CATCH END CATCH
    BEGIN TRY INSERT INTO enrollments (student_id, class_id, status) VALUES (@sv_id, ((@cls_offset + 5) % @total_classes) + 1, 'active'); END TRY BEGIN CATCH END CATCH
    BEGIN TRY INSERT INTO enrollments (student_id, class_id, status) VALUES (@sv_id, ((@cls_offset + 10) % @total_classes) + 1, 'active'); END TRY BEGIN CATCH END CATCH
    BEGIN TRY INSERT INTO enrollments (student_id, class_id, status) VALUES (@sv_id, ((@cls_offset + 15) % @total_classes) + 1, 'active'); END TRY BEGIN CATCH END CATCH
    BEGIN TRY INSERT INTO enrollments (student_id, class_id, status) VALUES (@sv_id, ((@cls_offset + 20) % @total_classes) + 1, 'active'); END TRY BEGIN CATCH END CATCH
    
    SET @sv_row = @sv_row + 1;
    FETCH NEXT FROM sv_cursor INTO @sv_id;
END

CLOSE sv_cursor;
DEALLOCATE sv_cursor;

DECLARE @enroll_count INT = (SELECT COUNT(*) FROM enrollments);
PRINT N'✅ Enrollments: ' + CAST(@enroll_count AS NVARCHAR) + N' records';
GO

-- =====================================================
-- 6. ATTENDANCES (điểm danh 10 buổi đầu, 10 lớp đầu)
-- =====================================================
DECLARE @sched_id INT;
DECLARE @enroll_student_id INT;
DECLARE @enroll_class_id INT;
DECLARE @att_status NVARCHAR(20);
DECLARE @rand_val INT;

DECLARE schedule_cursor CURSOR FOR
    SELECT s.id, s.class_id FROM schedules s WHERE s.session_number <= 10 AND s.class_id <= 10;

OPEN schedule_cursor;
FETCH NEXT FROM schedule_cursor INTO @sched_id, @enroll_class_id;

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE student_cursor CURSOR FOR
        SELECT student_id FROM enrollments WHERE class_id = @enroll_class_id AND status = 'active';
    
    OPEN student_cursor;
    FETCH NEXT FROM student_cursor INTO @enroll_student_id;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @rand_val = ABS(CHECKSUM(NEWID())) % 100;
        SET @att_status = CASE 
            WHEN @rand_val < 75 THEN 'present'
            WHEN @rand_val < 85 THEN 'late'
            WHEN @rand_val < 92 THEN 'absent'
            ELSE 'excused' END;
        
        BEGIN TRY
            INSERT INTO attendances (schedule_id, student_id, status, recorded_by)
            VALUES (@sched_id, @enroll_student_id, @att_status, 
                (SELECT lecturer_id FROM classes WHERE id = @enroll_class_id));
        END TRY
        BEGIN CATCH END CATCH
        
        FETCH NEXT FROM student_cursor INTO @enroll_student_id;
    END
    
    CLOSE student_cursor;
    DEALLOCATE student_cursor;
    
    FETCH NEXT FROM schedule_cursor INTO @sched_id, @enroll_class_id;
END

CLOSE schedule_cursor;
DEALLOCATE schedule_cursor;

DECLARE @att_count INT = (SELECT COUNT(*) FROM attendances);
PRINT N'✅ Attendances: ' + CAST(@att_count AS NVARCHAR) + N' records';
GO

-- =====================================================
-- 7. GRADES (điểm cho 15 lớp đầu)
-- =====================================================
DECLARE @grade_enroll_id INT;
DECLARE @grade_student_id INT;
DECLARE @grade_class_id INT;
DECLARE @midterm DECIMAL(4,1);
DECLARE @final_s DECIMAL(4,1);
DECLARE @assignment DECIMAL(4,1);
DECLARE @final_grade DECIMAL(4,2);
DECLARE @letter NVARCHAR(5);

DECLARE grade_cursor CURSOR FOR
    SELECT id, student_id, class_id FROM enrollments WHERE class_id <= 15;

OPEN grade_cursor;
FETCH NEXT FROM grade_cursor INTO @grade_enroll_id, @grade_student_id, @grade_class_id;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @midterm = CAST(ROUND((ABS(CHECKSUM(NEWID())) % 60 + 40) / 10.0, 1) AS DECIMAL(4,1));
    SET @final_s = CAST(ROUND((ABS(CHECKSUM(NEWID())) % 60 + 30) / 10.0, 1) AS DECIMAL(4,1));
    SET @assignment = CAST(ROUND((ABS(CHECKSUM(NEWID())) % 50 + 50) / 10.0, 1) AS DECIMAL(4,1));
    SET @final_grade = ROUND(@midterm * 0.3 + @final_s * 0.5 + @assignment * 0.2, 2);
    SET @letter = CASE
        WHEN @final_grade >= 8.5 THEN 'A'
        WHEN @final_grade >= 7.0 THEN 'B'
        WHEN @final_grade >= 5.5 THEN 'C'
        WHEN @final_grade >= 4.0 THEN 'D'
        ELSE 'F' END;
    
    INSERT INTO grades (enrollment_id, student_id, class_id, midterm_score, final_score, assignment_score, final_grade, letter_grade, status, graded_by, graded_at)
    VALUES (@grade_enroll_id, @grade_student_id, @grade_class_id, @midterm, @final_s, @assignment, @final_grade, @letter, 'finalized',
        (SELECT lecturer_id FROM classes WHERE id = @grade_class_id), GETDATE());
    
    FETCH NEXT FROM grade_cursor INTO @grade_enroll_id, @grade_student_id, @grade_class_id;
END

CLOSE grade_cursor;
DEALLOCATE grade_cursor;

DECLARE @grade_count INT = (SELECT COUNT(*) FROM grades);
PRINT N'✅ Grades: ' + CAST(@grade_count AS NVARCHAR) + N' records';
GO

-- =====================================================
-- 8. APPEALS (phúc khảo mẫu)
-- =====================================================
INSERT INTO appeals (grade_id, student_id, reason, current_score, requested_score, status)
SELECT TOP 10 g.id, g.student_id, N'Em cho rằng bài thi giữa kỳ chấm chưa chính xác, xin phúc khảo', g.midterm_score, g.midterm_score + 1, 'pending'
FROM grades g WHERE g.final_grade < 5.5 ORDER BY NEWID();

INSERT INTO appeals (grade_id, student_id, reason, current_score, requested_score, status, reviewer_id, reviewer_comment, reviewed_at)
SELECT TOP 5 g.id, g.student_id, N'Em muốn phúc khảo bài thi cuối kỳ', g.final_score, g.final_score + 0.5, 'approved',
    (SELECT lecturer_id FROM classes WHERE id = g.class_id), N'Đã xem xét lại bài thi, điều chỉnh điểm', GETDATE()
FROM grades g WHERE g.final_grade BETWEEN 4.0 AND 5.5 AND g.id NOT IN (SELECT grade_id FROM appeals) ORDER BY NEWID();

INSERT INTO appeals (grade_id, student_id, reason, current_score, requested_score, status, reviewer_id, reviewer_comment, reviewed_at)
SELECT TOP 5 g.id, g.student_id, N'Em thấy điểm bài tập chưa đúng', g.assignment_score, g.assignment_score + 1.0, 'rejected',
    (SELECT lecturer_id FROM classes WHERE id = g.class_id), N'Đã xem xét kỹ, điểm chấm chính xác', GETDATE()
FROM grades g WHERE g.final_grade BETWEEN 5.5 AND 7.0 AND g.id NOT IN (SELECT grade_id FROM appeals) ORDER BY NEWID();

DECLARE @appeal_count INT = (SELECT COUNT(*) FROM appeals);
PRINT N'✅ Appeals: ' + CAST(@appeal_count AS NVARCHAR) + N' records';
GO

-- =====================================================
-- 9. NOTIFICATIONS (100 thông báo)
-- =====================================================
DECLARE @notif_i INT = 1;
DECLARE @notif_user INT;
DECLARE @notif_title NVARCHAR(200);
DECLARE @notif_msg NVARCHAR(MAX);
DECLARE @notif_type NVARCHAR(30);
DECLARE @min_sv_id INT = (SELECT MIN(id) FROM users WHERE role = 'student');

WHILE @notif_i <= 100
BEGIN
    SET @notif_user = @min_sv_id + (@notif_i % 200);
    -- Đảm bảo user tồn tại
    IF EXISTS (SELECT 1 FROM users WHERE id = @notif_user)
    BEGIN
        SET @notif_type = CASE (@notif_i % 4) WHEN 0 THEN 'info' WHEN 1 THEN 'warning' WHEN 2 THEN 'grade' ELSE 'attendance' END;
        SET @notif_title = CASE (@notif_i % 4) 
            WHEN 0 THEN N'Thông báo chung từ nhà trường'
            WHEN 1 THEN N'Cảnh báo chuyên cần'
            WHEN 2 THEN N'Thông báo điểm mới'
            ELSE N'Điểm danh buổi học' END;
        SET @notif_msg = CASE (@notif_i % 4)
            WHEN 0 THEN N'Nhà trường thông báo lịch nghỉ lễ 30/4 - 1/5. Sinh viên chú ý.'
            WHEN 1 THEN N'Bạn đã vắng quá 20% số buổi học. Vui lòng liên hệ cố vấn học tập.'
            WHEN 2 THEN N'Điểm giữa kỳ đã được cập nhật. Vui lòng kiểm tra.'
            ELSE N'Buổi học ngày hôm nay đã được điểm danh thành công.' END;
        
        INSERT INTO notifications (user_id, title, message, type, is_read)
        VALUES (@notif_user, @notif_title, @notif_msg, @notif_type, CASE WHEN @notif_i % 3 = 0 THEN 1 ELSE 0 END);
    END
    SET @notif_i = @notif_i + 1;
END

DECLARE @notif_count INT = (SELECT COUNT(*) FROM notifications);
PRINT N'✅ Notifications: ' + CAST(@notif_count AS NVARCHAR) + N' records';
GO

-- =====================================================
-- 10. AUDIT LOGS (50 mẫu)
-- =====================================================
INSERT INTO audit_logs (user_id, action, entity, entity_id, new_values, ip_address) VALUES 
(1, 'CREATE', 'subject', 1, N'{"code":"CS101","name":"Nhập môn lập trình"}', '127.0.0.1'),
(1, 'CREATE', 'subject', 2, N'{"code":"CS102","name":"CTDL & Giải thuật"}', '127.0.0.1'),
(1, 'CREATE', 'class', 1, N'{"code":"CS101-01"}', '127.0.0.1'),
(1, 'UPDATE', 'user', 20, N'{"role":"student","is_active":true}', '127.0.0.1'),
(2, 'CREATE', 'grade', 1, N'{"midterm_score":7.5}', '192.168.1.10'),
(2, 'UPDATE', 'grade', 1, N'{"final_score":8.0}', '192.168.1.10'),
(1, 'DELETE', 'enrollment', 5, N'{"status":"dropped"}', '127.0.0.1'),
(3, 'CREATE', 'attendance', 1, N'{"status":"present"}', '192.168.1.11'),
(2, 'UPDATE', 'appeal', 1, N'{"status":"approved"}', '192.168.1.10'),
(1, 'CREATE', 'notification', 1, N'{"type":"info"}', '127.0.0.1');

DECLARE @audit_i INT = 11;
WHILE @audit_i <= 50
BEGIN
    INSERT INTO audit_logs (user_id, action, entity, entity_id, ip_address)
    VALUES (
        CASE WHEN @audit_i % 3 = 0 THEN 1 WHEN @audit_i % 3 = 1 THEN 2 ELSE 3 END,
        CASE WHEN @audit_i % 4 = 0 THEN 'CREATE' WHEN @audit_i % 4 = 1 THEN 'UPDATE' WHEN @audit_i % 4 = 2 THEN 'READ' ELSE 'DELETE' END,
        CASE WHEN @audit_i % 5 = 0 THEN 'user' WHEN @audit_i % 5 = 1 THEN 'grade' WHEN @audit_i % 5 = 2 THEN 'attendance' WHEN @audit_i % 5 = 3 THEN 'class' ELSE 'subject' END,
        @audit_i, '127.0.0.1');
    SET @audit_i = @audit_i + 1;
END

DECLARE @audit_count INT = (SELECT COUNT(*) FROM audit_logs);
PRINT N'✅ Audit Logs: ' + CAST(@audit_count AS NVARCHAR) + N' records';
GO

-- =====================================================
-- TỔNG KẾT
-- =====================================================
PRINT N'';
PRINT N'========================================';
PRINT N'📊 TỔNG KẾT SEED DATA';
PRINT N'========================================';

SELECT 'users' AS [Table], COUNT(*) AS [Count] FROM users
UNION ALL SELECT 'subjects', COUNT(*) FROM subjects
UNION ALL SELECT 'classes', COUNT(*) FROM classes
UNION ALL SELECT 'schedules', COUNT(*) FROM schedules
UNION ALL SELECT 'enrollments', COUNT(*) FROM enrollments
UNION ALL SELECT 'attendances', COUNT(*) FROM attendances
UNION ALL SELECT 'grades', COUNT(*) FROM grades
UNION ALL SELECT 'appeals', COUNT(*) FROM appeals
UNION ALL SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL SELECT 'audit_logs', COUNT(*) FROM audit_logs;

DECLARE @total INT = (SELECT COUNT(*) FROM users) + (SELECT COUNT(*) FROM subjects) +
    (SELECT COUNT(*) FROM classes) + (SELECT COUNT(*) FROM schedules) +
    (SELECT COUNT(*) FROM enrollments) + (SELECT COUNT(*) FROM attendances) +
    (SELECT COUNT(*) FROM grades) + (SELECT COUNT(*) FROM appeals) +
    (SELECT COUNT(*) FROM notifications) + (SELECT COUNT(*) FROM audit_logs);

PRINT N'✅ TỔNG CỘNG: ' + CAST(@total AS NVARCHAR) + N' bản ghi';
PRINT N'';
PRINT N'📋 TÀI KHOẢN ĐĂNG NHẬP:';
PRINT N'  Admin:     admin@university.edu.vn / password';
PRINT N'  Giảng viên: nguyenvana@university.edu.vn / password';
PRINT N'  Cố vấn:    nguyenq@university.edu.vn / password';  
PRINT N'  Sinh viên:  student1@student.edu.vn / password';
PRINT N'  (Mật khẩu bcrypt hash chung: password)';
GO

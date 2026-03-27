const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { sequelize, User, Subject, Class, Schedule, Enrollment, Attendance, Grade, Notification } = require('./models');
const bcrypt = require('bcryptjs');

const subjectNames = [
  { name: 'Lập trình Web', code: 'IT001', credits: 3, department: 'CNTT' },
  { name: 'Cơ sở dữ liệu', code: 'IT002', credits: 3, department: 'CNTT' },
  { name: 'Cấu trúc dữ liệu và giải thuật', code: 'IT003', credits: 4, department: 'CNTT' },
  { name: 'Mạng máy tính', code: 'IT004', credits: 3, department: 'CNTT' },
  { name: 'Hệ điều hành', code: 'IT005', credits: 3, department: 'CNTT' },
  { name: 'Trí tuệ nhân tạo', code: 'IT006', credits: 3, department: 'CNTT' },
  { name: 'Công nghệ phần mềm', code: 'IT007', credits: 3, department: 'CNTT' },
  { name: 'An toàn thông tin', code: 'IT008', credits: 3, department: 'CNTT' },
  { name: 'Toán cao cấp 1', code: 'MA001', credits: 4, department: 'Toán' },
  { name: 'Toán cao cấp 2', code: 'MA002', credits: 4, department: 'Toán' },
  { name: 'Xác suất thống kê', code: 'MA003', credits: 3, department: 'Toán' },
  { name: 'Vật lý đại cương', code: 'PH001', credits: 3, department: 'Vật lý' },
  { name: 'Tiếng Anh 1', code: 'EN001', credits: 3, department: 'Ngoại ngữ' },
  { name: 'Tiếng Anh 2', code: 'EN002', credits: 3, department: 'Ngoại ngữ' },
  { name: 'Kinh tế vi mô', code: 'EC001', credits: 3, department: 'Kinh tế' },
  { name: 'Lập trình hướng đối tượng', code: 'IT009', credits: 3, department: 'CNTT' },
  { name: 'Phân tích thiết kế hệ thống', code: 'IT010', credits: 3, department: 'CNTT' },
  { name: 'Machine Learning', code: 'IT011', credits: 3, department: 'CNTT' },
  { name: 'DevOps', code: 'IT012', credits: 3, department: 'CNTT' },
  { name: 'Lập trình di động', code: 'IT013', credits: 3, department: 'CNTT' },
];

const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
const middleNames = ['Văn', 'Thị', 'Đức', 'Minh', 'Hoàng', 'Thanh', 'Quốc', 'Xuân', 'Hữu', 'Ngọc'];
const firstNames = ['An', 'Bình', 'Cường', 'Dung', 'Em', 'Phong', 'Giang', 'Hà', 'Hùng', 'Khoa', 'Linh', 'Mai', 'Nam', 'Oanh', 'Phúc', 'Quân', 'Sơn', 'Tâm', 'Uyên', 'Vinh', 'Yến', 'Đạt', 'Thảo', 'Hương', 'Tuấn', 'Long', 'Hải', 'Dũng', 'Thắng', 'Tùng'];
const rooms = ['A101', 'A102', 'A201', 'A202', 'B101', 'B102', 'B201', 'B202', 'C101', 'C102', 'C201', 'C301'];

function randomName() {
  const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
  const mn = middleNames[Math.floor(Math.random() * middleNames.length)];
  const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
  return `${ln} ${mn} ${fn}`;
}

function randomFloat(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

async function seed() {
  try {
    console.log('🌱 Starting seed...');
    await sequelize.sync({ force: true });
    console.log('✅ Database reset');

    // 1. Create users
    console.log('👤 Creating users...');
    const hashedPass = await bcrypt.hash('Admin@123', 10);
    const studentPass = await bcrypt.hash('Student@123', 10);
    const lecturerPass = await bcrypt.hash('Lecturer@123', 10);

    // Admin
    const admin = await User.create({
      username: 'admin', email: 'admin@university.edu.vn', password: hashedPass,
      full_name: 'Admin Hệ thống', role: 'admin', phone: '0901234567',
    }, { hooks: false });

    // Advisors (3)
    const advisors = [];
    for (let i = 1; i <= 3; i++) {
      const advisor = await User.create({
        username: `advisor${i}`, email: `advisor${i}@university.edu.vn`, password: lecturerPass,
        full_name: randomName(), role: 'advisor', phone: `090${1000000 + i}`,
        lecturer_code: `ADV${String(i).padStart(3, '0')}`,
      }, { hooks: false });
      advisors.push(advisor);
    }

    // Lecturers (15)
    const lecturers = [];
    for (let i = 1; i <= 15; i++) {
      const lecturer = await User.create({
        username: `lecturer${i}`, email: `lecturer${i}@university.edu.vn`, password: lecturerPass,
        full_name: randomName(), role: 'lecturer', phone: `091${1000000 + i}`,
        lecturer_code: `GV${String(i).padStart(3, '0')}`,
      }, { hooks: false });
      lecturers.push(lecturer);
    }

    // Students (200)
    const students = [];
    for (let i = 1; i <= 200; i++) {
      const student = await User.create({
        username: `student${i}`, email: `student${i}@student.edu.vn`, password: studentPass,
        full_name: randomName(), role: 'student', phone: `092${1000000 + i}`,
        student_code: `SV${String(i).padStart(5, '0')}`,
      }, { hooks: false });
      students.push(student);
    }
    console.log(`✅ Created ${1 + 3 + 15 + 200} users`);

    // 2. Create subjects
    console.log('📚 Creating subjects...');
    const subjects = [];
    for (const s of subjectNames) {
      const subject = await Subject.create({
        name: s.name, code: s.code, credits: s.credits, department: s.department,
        description: `Môn học ${s.name} thuộc khoa ${s.department}`,
        grade_formula: { midterm: 0.3, final: 0.5, assignment: 0.2 },
      });
      subjects.push(subject);
    }
    console.log(`✅ Created ${subjects.length} subjects`);

    // 3. Create classes (40 classes)
    console.log('🏫 Creating classes...');
    const classes = [];
    const semesters = [1, 2];
    const years = ['2024-2025', '2025-2026'];

    for (let i = 0; i < 40; i++) {
      const subject = subjects[i % subjects.length];
      const lecturer = lecturers[i % lecturers.length];
      const year = years[Math.floor(i / 20)];
      const sem = semesters[i % 2];

      const cls = await Class.create({
        name: `${subject.code}.${String(i + 1).padStart(2, '0')}`,
        code: `${subject.code}.${year.split('-')[0]}.${sem}.${String(i + 1).padStart(2, '0')}`,
        subject_id: subject.id,
        lecturer_id: lecturer.id,
        academic_year: year,
        semester: sem,
        max_students: 50,
        room: rooms[i % rooms.length],
        status: i < 30 ? 'active' : 'completed',
        start_date: `${year.split('-')[0]}-${sem === 1 ? '09' : '02'}-01`,
        end_date: `${sem === 1 ? year.split('-')[0] : year.split('-')[1]}-${sem === 1 ? '12' : '06'}-30`,
        grade_formula: { midterm: 0.3, final: 0.5, assignment: 0.2 },
        max_absent_percent: 20,
      });
      classes.push(cls);
    }
    console.log(`✅ Created ${classes.length} classes`);

    // 4. Create schedules (15 sessions per class = 600 schedules)
    console.log('📅 Creating schedules...');
    let scheduleCount = 0;
    const allSchedules = [];
    for (const cls of classes) {
      const startMonth = cls.semester === 1 ? 9 : 2;
      const startYear = parseInt(cls.academic_year.split('-')[0]);

      for (let j = 1; j <= 15; j++) {
        const weekOffset = j - 1;
        const date = new Date(startYear, startMonth - 1, 1 + weekOffset * 7);
        const schedule = await Schedule.create({
          class_id: cls.id,
          session_number: j,
          day_of_week: (j % 5) + 1,
          start_time: '07:30',
          end_time: '09:30',
          room: cls.room,
          session_date: date.toISOString().split('T')[0],
          type: j === 15 ? 'exam' : 'lecture',
          is_cancelled: false,
        });
        allSchedules.push(schedule);
        scheduleCount++;
      }
    }
    console.log(`✅ Created ${scheduleCount} schedules`);

    // 5. Create enrollments (each student enrolls in 4-6 classes)
    console.log('📝 Creating enrollments...');
    const enrollments = [];
    for (const student of students) {
      const numClasses = 4 + Math.floor(Math.random() * 3);
      const shuffled = [...classes].sort(() => Math.random() - 0.5);
      const selectedClasses = shuffled.slice(0, numClasses);

      for (const cls of selectedClasses) {
        const enrollment = await Enrollment.create({
          student_id: student.id,
          class_id: cls.id,
          status: 'enrolled',
        });
        enrollments.push(enrollment);
      }
    }
    console.log(`✅ Created ${enrollments.length} enrollments`);

    // 6. Create attendances
    console.log('✋ Creating attendances...');
    let attendanceCount = 0;
    const statuses = ['present', 'present', 'present', 'present', 'absent', 'late', 'excused'];
    
    for (const enrollment of enrollments) {
      const classSchedules = allSchedules.filter(s => s.class_id === enrollment.class_id);
      const numSessions = Math.min(classSchedules.length, 10 + Math.floor(Math.random() * 5));

      for (let j = 0; j < numSessions; j++) {
        const schedule = classSchedules[j];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        await Attendance.create({
          enrollment_id: enrollment.id,
          student_id: enrollment.student_id,
          class_id: enrollment.class_id,
          schedule_id: schedule.id,
          status,
          check_in_time: status !== 'absent' ? new Date() : null,
          recorded_by: 1,
        });
        attendanceCount++;
      }
    }
    console.log(`✅ Created ${attendanceCount} attendance records`);

    // 7. Create grades
    console.log('📊 Creating grades...');
    let gradeCount = 0;
    const components = ['midterm', 'final', 'assignment'];

    for (const enrollment of enrollments) {
      for (const component of components) {
        const score = randomFloat(3.0, 10.0);
        const weight = component === 'midterm' ? 0.3 : component === 'final' ? 0.5 : 0.2;
        
        await Grade.create({
          enrollment_id: enrollment.id,
          student_id: enrollment.student_id,
          class_id: enrollment.class_id,
          component,
          score,
          weight,
          graded_by: 1,
          graded_at: new Date(),
        });
        gradeCount++;
      }
    }
    console.log(`✅ Created ${gradeCount} grade records`);

    // 8. Create some notifications
    console.log('🔔 Creating notifications...');
    let notifCount = 0;
    for (let i = 0; i < 50; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      await Notification.create({
        user_id: student.id,
        title: ['Cảnh báo chuyên cần', 'Điểm mới cập nhật', 'Thông báo lịch thi', 'Nhắc nhở đăng ký môn'][i % 4],
        message: 'Đây là thông báo từ hệ thống quản lý đào tạo.',
        type: ['warning', 'grade', 'info', 'info'][i % 4],
        is_read: Math.random() > 0.5,
      });
      notifCount++;
    }
    console.log(`✅ Created ${notifCount} notifications`);

    const totalRecords = (1 + 3 + 15 + 200) + subjects.length + classes.length + scheduleCount + enrollments.length + attendanceCount + gradeCount + notifCount;
    console.log(`\n🎉 Seed completed! Total records: ${totalRecords}`);
    console.log('\n📋 Login credentials:');
    console.log('  Admin: admin@university.edu.vn / Admin@123');
    console.log('  Lecturer: lecturer1@university.edu.vn / Lecturer@123');
    console.log('  Advisor: advisor1@university.edu.vn / Lecturer@123');
    console.log('  Student: student1@student.edu.vn / Student@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();

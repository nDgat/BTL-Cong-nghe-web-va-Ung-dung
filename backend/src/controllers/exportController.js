const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Enrollment, Class, Subject, User, Attendance, Grade, Schedule } = require('../models');
const { createAuditLog } = require('../middleware/audit');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Export grades to Excel
exports.exportGradesToExcel = async (req, res, next) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findByPk(classId, {
      include: [{ model: Subject, as: 'subject' }],
    });
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });

    const enrollments = await Enrollment.findAll({
      where: { class_id: classId },
      include: [
        { model: User, as: 'student', attributes: ['id', 'full_name', 'student_code', 'email'] },
        { model: Grade, as: 'grades' },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Bảng điểm');

    // Header
    sheet.mergeCells('A1:H1');
    sheet.getCell('A1').value = `BẢNG ĐIỂM - ${cls.name}`;
    sheet.getCell('A1').font = { bold: true, size: 14 };
    sheet.getCell('A2').value = `Môn: ${cls.subject?.name} (${cls.subject?.code})`;
    sheet.getCell('A3').value = `Niên khóa: ${cls.academic_year} - HK${cls.semester}`;

    // Formula info
    const formula = cls.grade_formula;
    const components = Object.keys(formula);

    // Column headers
    const headers = ['STT', 'MSSV', 'Họ tên', 'Email', ...components.map(c => `${c} (${(formula[c] * 100).toFixed(0)}%)`), 'Điểm TK', 'Xếp loại', 'Trạng thái'];
    const headerRow = sheet.addRow([]);
    sheet.addRow(headers);
    const headerRowNum = sheet.lastRow;
    headerRowNum.font = { bold: true };
    headerRowNum.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4472C4' } };
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Data rows
    enrollments.forEach((enrollment, idx) => {
      const gradeMap = {};
      enrollment.grades.forEach(g => { gradeMap[g.component] = g.score; });

      const row = [
        idx + 1,
        enrollment.student?.student_code,
        enrollment.student?.full_name,
        enrollment.student?.email,
        ...components.map(c => gradeMap[c] !== undefined ? gradeMap[c] : ''),
        enrollment.final_grade || '',
        enrollment.letter_grade || '',
        enrollment.status,
      ];
      const dataRow = sheet.addRow(row);
      dataRow.eachCell(cell => {
        cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    // Auto-width
    sheet.columns.forEach(col => { col.width = 15; });
    sheet.getColumn(3).width = 25;
    sheet.getColumn(4).width = 30;

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'EXPORT', entity: 'Grade',
      description: `Exported grades for class ${cls.code}`, req,
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=grades_${cls.code}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) { next(error); }
};

// Export attendance to Excel
exports.exportAttendanceToExcel = async (req, res, next) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findByPk(classId, { include: [{ model: Subject, as: 'subject' }] });
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });

    const schedules = await Schedule.findAll({
      where: { class_id: classId, is_cancelled: false },
      order: [['session_date', 'ASC']],
    });

    const enrollments = await Enrollment.findAll({
      where: { class_id: classId },
      include: [{ model: User, as: 'student', attributes: ['id', 'full_name', 'student_code'] }],
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Điểm danh');

    sheet.mergeCells('A1:F1');
    sheet.getCell('A1').value = `BẢNG ĐIỂM DANH - ${cls.name}`;
    sheet.getCell('A1').font = { bold: true, size: 14 };

    const headers = ['STT', 'MSSV', 'Họ tên', ...schedules.map((s, i) => `B${i + 1}\n${s.session_date || ''}`), 'Tổng vắng', '% Vắng'];
    sheet.addRow([]);
    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };

    for (const [idx, enrollment] of enrollments.entries()) {
      const attendances = await Attendance.findAll({
        where: { enrollment_id: enrollment.id },
      });
      const attMap = {};
      attendances.forEach(a => { attMap[a.schedule_id] = a.status; });

      const absentCount = attendances.filter(a => a.status === 'absent').length;
      const absentPercent = schedules.length > 0 ? ((absentCount / schedules.length) * 100).toFixed(1) : 0;

      const statusMap = { present: 'P', absent: 'A', late: 'L', excused: 'E' };
      const row = [
        idx + 1,
        enrollment.student?.student_code,
        enrollment.student?.full_name,
        ...schedules.map(s => statusMap[attMap[s.id]] || '-'),
        absentCount,
        `${absentPercent}%`,
      ];
      sheet.addRow(row);
    }

    sheet.columns.forEach(col => { col.width = 10; });
    sheet.getColumn(3).width = 25;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_${cls.code}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) { next(error); }
};

// Export grades to CSV
exports.exportGradesToCSV = async (req, res, next) => {
  try {
    const classId = req.params.classId;
    const enrollments = await Enrollment.findAll({
      where: { class_id: classId },
      include: [
        { model: User, as: 'student', attributes: ['full_name', 'student_code', 'email'] },
        { model: Grade, as: 'grades' },
      ],
    });

    let csv = 'STT,MSSV,Ho ten,Email,Diem TK,Xep loai,Trang thai\n';
    enrollments.forEach((e, idx) => {
      csv += `${idx + 1},${e.student?.student_code},${e.student?.full_name},${e.student?.email},${e.final_grade || ''},${e.letter_grade || ''},${e.status}\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=grades_${classId}.csv`);
    res.send('\uFEFF' + csv); // BOM for UTF-8
  } catch (error) { next(error); }
};

// Export transcript to PDF
exports.exportTranscriptPDF = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user.id;
    const student = await User.findByPk(studentId);
    if (!student) return res.status(404).json({ error: 'Không tìm thấy sinh viên' });

    const enrollments = await Enrollment.findAll({
      where: { student_id: studentId },
      include: [
        { model: Class, as: 'class', include: [{ model: Subject, as: 'subject' }] },
        { model: Grade, as: 'grades' },
      ],
    });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=transcript_${student.student_code}.pdf`);
    doc.pipe(res);

    // Title
    doc.fontSize(18).text('BANG DIEM CA NHAN', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Ho ten: ${student.full_name}`);
    doc.text(`MSSV: ${student.student_code}`);
    doc.text(`Email: ${student.email}`);
    doc.moveDown();

    // Table header
    const startY = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('STT', 50, startY, { width: 30 });
    doc.text('Mon hoc', 85, startY, { width: 150 });
    doc.text('TC', 240, startY, { width: 30 });
    doc.text('Diem TK', 275, startY, { width: 60 });
    doc.text('Xep loai', 340, startY, { width: 50 });
    doc.text('Trang thai', 395, startY, { width: 80 });

    doc.moveDown();
    doc.font('Helvetica');

    enrollments.forEach((e, idx) => {
      const y = doc.y;
      if (y > 700) { doc.addPage(); }
      doc.text(`${idx + 1}`, 50, doc.y, { width: 30 });
      const curY = doc.y - 12;
      doc.text(e.class?.subject?.name || e.class?.name || '', 85, curY, { width: 150 });
      doc.text(`${e.class?.subject?.credits || ''}`, 240, curY, { width: 30 });
      doc.text(`${e.final_grade || ''}`, 275, curY, { width: 60 });
      doc.text(`${e.letter_grade || ''}`, 340, curY, { width: 50 });
      doc.text(`${e.status}`, 395, curY, { width: 80 });
    });

    doc.end();
  } catch (error) { next(error); }
};

// Import students from Excel
exports.importStudentsFromExcel = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Vui lòng upload file Excel' });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const sheet = workbook.getWorksheet(1);

    const results = [];
    const errors = [];
    let rowNum = 0;

    sheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return; // Skip header
      rowNum++;
      const data = {
        student_code: row.getCell(1).value?.toString(),
        full_name: row.getCell(2).value?.toString(),
        email: row.getCell(3).value?.toString(),
        phone: row.getCell(4).value?.toString(),
      };
      results.push(data);
    });

    const created = [];
    for (const data of results) {
      try {
        const username = data.student_code || data.email?.split('@')[0];
        const [user, wasCreated] = await User.findOrCreate({
          where: { student_code: data.student_code },
          defaults: {
            username,
            email: data.email || `${username}@student.edu.vn`,
            password: 'Student@123',
            full_name: data.full_name,
            phone: data.phone,
            role: 'student',
            student_code: data.student_code,
          },
        });
        created.push({ ...data, status: wasCreated ? 'created' : 'existed', id: user.id });
      } catch (err) {
        errors.push({ ...data, error: err.message });
      }
    }

    // Clean up uploaded file
    if (req.file?.path) fs.unlinkSync(req.file.path);

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'IMPORT', entity: 'User',
      description: `Imported ${created.length} students from Excel`, req,
    });

    res.json({
      message: `Import hoàn tất: ${created.filter(c => c.status === 'created').length} tạo mới, ${created.filter(c => c.status === 'existed').length} đã tồn tại, ${errors.length} lỗi`,
      data: { created, errors },
    });
  } catch (error) { next(error); }
};

const { Grade, Enrollment, Class, User, Subject } = require('../models');
const { getPagination, getPaginationData, calculateLetterGrade, calculateFinalGrade } = require('../utils/helpers');
const { createAuditLog } = require('../middleware/audit');

// Get grades
exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const where = {};
    if (req.query.class_id) where.class_id = req.query.class_id;
    if (req.query.student_id) where.student_id = req.query.student_id;
    if (req.query.enrollment_id) where.enrollment_id = req.query.enrollment_id;
    if (req.query.component) where.component = req.query.component;

    const data = await Grade.findAndCountAll({
      where, limit, offset,
      include: [
        { model: User, as: 'student', attributes: ['id', 'full_name', 'student_code'] },
        { model: Enrollment, as: 'enrollment' },
      ],
      order: [['created_at', 'DESC']],
    });
    const result = getPaginationData(data, page, limit);
    res.json({ data: result.items, pagination: result.pagination });
  } catch (error) { next(error); }
};

// Input grades for a class (batch)
exports.inputGrades = async (req, res, next) => {
  try {
    const { class_id, component, grades } = req.body;
    // grades: [{ enrollment_id, student_id, score, note }]

    const cls = await Class.findByPk(class_id);
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });

    const formula = cls.grade_formula;
    const weight = formula[component] || 0;

    const results = [];
    for (const g of grades) {
      const [grade, created] = await Grade.findOrCreate({
        where: { enrollment_id: g.enrollment_id, component },
        defaults: {
          student_id: g.student_id,
          class_id,
          enrollment_id: g.enrollment_id,
          component,
          score: g.score,
          weight,
          graded_by: req.user.id,
          graded_at: new Date(),
          note: g.note,
        },
      });

      if (!created) {
        const oldValues = grade.toJSON();
        grade.score = g.score;
        grade.note = g.note;
        grade.graded_by = req.user.id;
        grade.graded_at = new Date();
        grade.version = grade.version + 1;
        await grade.save();

        await createAuditLog({
          userId: req.user.id, userName: req.user.full_name,
          action: 'UPDATE_GRADE', entity: 'Grade', entityId: grade.id,
          oldValues, newValues: { score: g.score, component }, req,
          description: `Updated grade for enrollment ${g.enrollment_id}, component: ${component}`,
        });
      }
      results.push(grade);
    }

    res.json({ message: 'Nhập điểm thành công', data: results });
  } catch (error) { next(error); }
};

// Calculate final grades for a class
exports.calculateFinalGrades = async (req, res, next) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findByPk(classId);
    if (!cls) return res.status(404).json({ error: 'Không tìm thấy lớp học' });

    const enrollments = await Enrollment.findAll({
      where: { class_id: classId, status: 'enrolled' },
      include: [
        { model: Grade, as: 'grades' },
        { model: User, as: 'student', attributes: ['id', 'full_name', 'student_code'] },
      ],
    });

    const formula = cls.grade_formula;
    const results = [];

    for (const enrollment of enrollments) {
      const finalScore = calculateFinalGrade(enrollment.grades, formula);
      const letterGrade = calculateLetterGrade(finalScore);

      enrollment.final_grade = finalScore;
      enrollment.letter_grade = letterGrade;
      enrollment.status = finalScore !== null && finalScore >= 4.0 ? 'completed' : 'failed';
      await enrollment.save();

      results.push({
        student: enrollment.student,
        grades: enrollment.grades,
        final_grade: finalScore,
        letter_grade: letterGrade,
        status: enrollment.status,
      });
    }

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'CALCULATE_GRADES', entity: 'Class', entityId: classId,
      newValues: { class_id: classId, students_count: results.length }, req,
    });

    res.json({ message: 'Tính điểm cuối kỳ thành công', data: results });
  } catch (error) { next(error); }
};

// Get student transcript
exports.getTranscript = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user.id;

    const enrollments = await Enrollment.findAll({
      where: { student_id: studentId },
      include: [
        {
          model: Class, as: 'class',
          include: [{ model: Subject, as: 'subject' }],
        },
        { model: Grade, as: 'grades' },
      ],
      order: [['created_at', 'DESC']],
    });

    const transcript = enrollments.map(e => ({
      class_code: e.class?.code,
      class_name: e.class?.name,
      subject_code: e.class?.subject?.code,
      subject_name: e.class?.subject?.name,
      credits: e.class?.subject?.credits,
      grades: e.grades,
      final_grade: e.final_grade,
      letter_grade: e.letter_grade,
      status: e.status,
    }));

    res.json({ data: transcript });
  } catch (error) { next(error); }
};

// Update single grade
exports.update = async (req, res, next) => {
  try {
    const grade = await Grade.findByPk(req.params.id);
    if (!grade) return res.status(404).json({ error: 'Không tìm thấy điểm' });

    const oldValues = grade.toJSON();
    grade.score = req.body.score !== undefined ? req.body.score : grade.score;
    grade.note = req.body.note || grade.note;
    grade.graded_by = req.user.id;
    grade.graded_at = new Date();
    grade.version = grade.version + 1;
    await grade.save();

    await createAuditLog({
      userId: req.user.id, userName: req.user.full_name,
      action: 'UPDATE_GRADE', entity: 'Grade', entityId: grade.id,
      oldValues, newValues: req.body, req,
    });

    res.json({ message: 'Cập nhật điểm thành công', data: grade });
  } catch (error) { next(error); }
};

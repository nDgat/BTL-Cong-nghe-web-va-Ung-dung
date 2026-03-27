const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('enrolled', 'dropped', 'completed', 'failed'),
    defaultValue: 'enrolled',
  },
  enrolled_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  final_grade: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  letter_grade: {
    type: DataTypes.STRING(2),
    allowNull: true,
  },
  absent_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_warned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'enrollments',
  indexes: [
    { unique: true, fields: ['student_id', 'class_id'] },
  ],
});

module.exports = Enrollment;

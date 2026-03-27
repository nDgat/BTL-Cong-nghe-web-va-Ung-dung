const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lecturer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  academic_year: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'e.g. 2024-2025',
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 3 },
  },
  max_students: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  room: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active',
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  // Grade formula config as JSON: { "midterm": 0.3, "final": 0.5, "assignment": 0.2 }
  grade_formula: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: JSON.stringify({ midterm: 0.3, final: 0.5, assignment: 0.2 }),
    get() {
      const rawValue = this.getDataValue('grade_formula');
      return rawValue ? JSON.parse(rawValue) : { midterm: 0.3, final: 0.5, assignment: 0.2 };
    },
    set(value) {
      this.setDataValue('grade_formula', JSON.stringify(value));
    },
  },
  max_absent_percent: {
    type: DataTypes.FLOAT,
    defaultValue: 20,
    comment: 'Max absent percentage before warning',
  },
  total_sessions: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'classes',
});

module.exports = Class;

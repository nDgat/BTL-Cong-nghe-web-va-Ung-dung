const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  enrollment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  component: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'e.g. midterm, final, assignment, quiz',
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: { min: 0, max: 10 },
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Weight of this component (0-1)',
  },
  graded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  graded_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'grades',
  indexes: [
    { unique: true, fields: ['enrollment_id', 'component'] },
  ],
});

module.exports = Grade;

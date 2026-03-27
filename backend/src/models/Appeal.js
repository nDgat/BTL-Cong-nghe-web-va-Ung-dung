const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appeal = sequelize.define('Appeal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  grade_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  current_score: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  requested_score: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewing', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  reviewed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reviewer_comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  final_score: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'appeals',
});

module.exports = Appeal;

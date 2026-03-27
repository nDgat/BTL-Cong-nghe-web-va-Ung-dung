const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  enrollment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  schedule_id: {
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
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
    defaultValue: 'absent',
  },
  check_in_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  recorded_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'User ID of who recorded this attendance',
  },
}, {
  tableName: 'attendances',
  indexes: [
    { unique: true, fields: ['enrollment_id', 'schedule_id'] },
  ],
});

module.exports = Attendance;

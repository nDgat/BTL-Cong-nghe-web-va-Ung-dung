const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  day_of_week: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, max: 6 },
    comment: '0=Sunday, 1=Monday,...6=Saturday',
  },
  start_time: {
    type: DataTypes.STRING(5),
    allowNull: false,
    comment: 'HH:mm format',
  },
  end_time: {
    type: DataTypes.STRING(5),
    allowNull: false,
    comment: 'HH:mm format',
  },
  room: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('lecture', 'lab', 'exam'),
    defaultValue: 'lecture',
  },
  session_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Specific date for this session',
  },
  session_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_cancelled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'schedules',
});

module.exports = Schedule;

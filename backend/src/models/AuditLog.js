const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT, IMPORT, etc.',
  },
  entity: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'Table/entity name',
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  old_values: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const val = this.getDataValue('old_values');
      return val ? JSON.parse(val) : null;
    },
    set(value) {
      this.setDataValue('old_values', value ? JSON.stringify(value) : null);
    },
  },
  new_values: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const val = this.getDataValue('new_values');
      return val ? JSON.parse(val) : null;
    },
    set(value) {
      this.setDataValue('new_values', value ? JSON.stringify(value) : null);
    },
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'audit_logs',
  paranoid: false,
  updatedAt: false,
});

module.exports = AuditLog;

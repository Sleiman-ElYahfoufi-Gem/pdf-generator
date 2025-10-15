import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config.js';

export const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  src: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Template source file path or content'
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pdf_templates',
  timestamps: false,
  indexes: [
    {
      fields: ['name']
    }
  ]
});
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config.js';

export const UserTemplateAccess = sequelize.define('UserTemplateAccess', {
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  templateId: {
    type: DataTypes.INTEGER,
    field: 'template_id',
    allowNull: false,
    references: {
      model: 'pdf_templates',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'user_template_access',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'template_id']
    }
  ]
});
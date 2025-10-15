import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config.js';

export const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clientId: {
    type: DataTypes.STRING,
    field: 'client_id',
    allowNull: false
  },
  secretKey: {
    type: DataTypes.STRING,
    field: 'secret_key',
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['client_id', 'email']
    },
    {
      fields: ['email']
    }
  ]
});
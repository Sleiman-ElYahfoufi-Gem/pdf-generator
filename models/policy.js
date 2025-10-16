import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config.js';

export const Policy = sequelize.define('Policy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
  productId: {
    type: DataTypes.INTEGER,
    field: 'product_id',
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  policyNumber: {
    type: DataTypes.STRING(100),
    field: 'policy_number',
    allowNull: true,
    unique: true
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [[
        'Lapsed',
        'Underwriter Modification',
        'Rating Declined',
        'Rating Success',
        'Rating Pending',
        'Review'
      ]]
    }
  },
  policyLapsed: {
    type: DataTypes.DATEONLY,
    field: 'policy_lapsed',
    allowNull: false
  },
  premium: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  premiumCalculatedAt: {
    type: DataTypes.DATE,
    field: 'premium_calculated_at',
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'policies',
  timestamps: false,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['product_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['policy_lapsed']
    },
    {
      fields: ['status', 'policy_lapsed']
    },
    {
      fields: ['created_at']
    }
  ]
});
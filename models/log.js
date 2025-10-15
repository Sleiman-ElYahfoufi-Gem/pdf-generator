import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config.js';

export const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requestId: {
    type: DataTypes.UUID,
    field: 'request_id',
    allowNull: false,
    unique: true
  },
  method: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requestBody: {
    type: DataTypes.JSON,
    field: 'request_body',
    defaultValue: {}
  },
  queryParams: {
    type: DataTypes.JSON,
    field: 'query_params',
    defaultValue: {}
  },
  urlParams: {
    type: DataTypes.JSON,
    field: 'url_params',
    defaultValue: {}
  },
  requestHeaders: {
    type: DataTypes.JSON,
    field: 'request_headers',
    defaultValue: {}
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  ipAddress: {
    type: DataTypes.INET,
    field: 'ip_address',
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    field: 'user_agent',
    allowNull: true
  },
  requestTimestamp: {
    type: DataTypes.DATE,
    field: 'request_timestamp',
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  responseStatusCode: {
    type: DataTypes.INTEGER,
    field: 'response_status_code',
    allowNull: true
  },
  responseBody: {
    type: DataTypes.JSON,
    field: 'response_body',
    defaultValue: {}
  },
  responseTimeMs: {
    type: DataTypes.INTEGER,
    field: 'response_time_ms',
    allowNull: true
  },
  responseTimestamp: {
    type: DataTypes.DATE,
    field: 'response_timestamp',
    allowNull: true
  },
  errorMessage: {
    type: DataTypes.TEXT,
    field: 'error_message',
    allowNull: true
  },
  errorStack: {
    type: DataTypes.TEXT,
    field: 'error_stack',
    allowNull: true
  }
}, {
  tableName: 'logs',
  timestamps: false,
  indexes: [
    {
      fields: ['request_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['request_timestamp']
    },
    {
      fields: ['method', 'url']
    }
  ]
});
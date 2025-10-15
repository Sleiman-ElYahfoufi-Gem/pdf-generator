import { sequelize } from '../database/config.js';
import { User } from './user.js';
import { Template } from './template.js';
import { UserTemplateAccess } from './userTemplateAccess.js';
import { Log } from './log.js';

// Set up model relationships

// User and Template many-to-many relationship through UserTemplateAccess
User.belongsToMany(Template, {
  through: UserTemplateAccess,
  foreignKey: 'userId',
  otherKey: 'templateId',
  as: 'accessibleTemplates'
});

Template.belongsToMany(User, {
  through: UserTemplateAccess,
  foreignKey: 'templateId',
  otherKey: 'userId',
  as: 'authorizedUsers'
});

// User and Log relationship (one user can have many logs)
User.hasMany(Log, {
  foreignKey: 'userId',
  as: 'logs'
});

Log.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Export models and sequelize instance
export {
  sequelize,
  User,
  Template,
  UserTemplateAccess,
  Log
};

// Helper function to initialize all models
export const initializeModels = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    // Sync models (optional - use with caution in production)
    // await sequelize.sync({ alter: false });

    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};
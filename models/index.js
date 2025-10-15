import { sequelize } from '../database/config.js';
import { User } from './user.js';
import { Template } from './template.js';
import { UserTemplateAccess } from './userTemplateAccess.js';
import { Log } from './log.js';
import logger from '../utils/logger.js';
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
    logger.info('Database connection established successfully');


    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', {error:error});
    return false;
  }
};
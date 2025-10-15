import { User, Template, UserTemplateAccess } from '../models/index.js';

// Get all templates that a user has access to
export const getTemplatesForUser = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Template,
        as: 'accessibleTemplates',
        attributes: ['id', 'name', 'src'],
        through: { attributes: [] } // Don't include junction table attributes
      }
    ],
    order: [[{ model: Template, as: 'accessibleTemplates' }, 'name', 'ASC']]
  });

  if (!user) {
    return [];
  }

  return user.accessibleTemplates;
};

// Get ALL templates (not filtered by user)
export const getAllTemplates = async () => {
  const templates = await Template.findAll({
    attributes: ['id', 'name', 'src', 'createdAt'],
    order: [['name', 'ASC']]
  });
  return templates;
};

// Get a specific template by ID
export const getTemplateById = async (templateId) => {
  const template = await Template.findByPk(templateId);
  return template;
};

// Check if user has access to a specific template
export const userHasAccessToTemplate = async (userId, templateId) => {
  const accessRecord = await UserTemplateAccess.findOne({
    where: { userId, templateId }
  });
  return accessRecord !== null;
};
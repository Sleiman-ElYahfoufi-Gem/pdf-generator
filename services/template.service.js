import * as templateRepository from '../repositories/template.repository.js';

export const getAllTemplates = async () => {
  const templates = await templateRepository.getAllTemplates();

  if (!templates || templates.length === 0) {
    throw new Error("No templates found");
  }

  return templates;
};

export const getUserTemplates = async (userId) => {
  // Get all templates the user has access to
  const templates = await templateRepository.getTemplatesForUser(userId);

  if (!templates || templates.length === 0) {
    throw new Error("No templates available for this user");
  }

  return templates;
};
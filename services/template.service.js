import * as templateRepository from '../repositories/template.repository.js';

export const getAllTemplates = async () => {
  const templates = await templateRepository.getAllTemplates();
  
  if (!templates || templates.length === 0) {
    throw new Error("No templates found");
  }
  
  return templates;
};
import { query } from '../database/db.js';

// Get all templates that a user has access to
export const getTemplatesForUser = async (userId) => {
  const result = await query(
    `SELECT pt.id, pt.name, pt.src 
     FROM pdf_templates pt
     INNER JOIN user_template_access uta ON pt.id = uta.template_id
     WHERE uta.user_id = $1
     ORDER BY pt.name ASC`,
    [userId]
  );
  return result.rows;
};

// Get ALL templates (not filtered by user)
export const getAllTemplates = async () => {
  const result = await query(
    'SELECT id, name, src, created_at FROM pdf_templates ORDER BY name ASC'
  );
  return result.rows;
};

// Get a specific template by ID
export const getTemplateById = async (templateId) => {
  const result = await query(
    'SELECT * FROM pdf_templates WHERE id = $1',
    [templateId]
  );
  return result.rows[0] || null;
};

// Check if user has access to a specific template
export const userHasAccessToTemplate = async (userId, templateId) => {
  const result = await query(
    'SELECT * FROM user_template_access WHERE user_id = $1 AND template_id = $2',
    [userId, templateId]
  );
  return result.rows.length > 0;
};
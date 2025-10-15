import { getAllTemplates } from '../services/template.service.js';
import logger from '../utils/logger.js';
export const getTemplates = async (req, res) => {
  try {
    const templates = await getAllTemplates();
    res.json({ success: true, data: templates });
  } catch (error) {
    logger.error('Error fetching templates:', { error: err });

    res.status(500).json({ success: false, message: error.message });
  }
};
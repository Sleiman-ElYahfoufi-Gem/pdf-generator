import { getAllTemplates } from '../services/template.service.js';

export const getTemplates = async (req, res) => {
  try {
    const templates = await getAllTemplates();
    res.json({ success: true, data: templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
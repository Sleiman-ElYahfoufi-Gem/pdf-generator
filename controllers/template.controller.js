import { getAllTemplates, getUserTemplates as getUserTemplatesFromService } from '../services/template.service.js';
import logger from '../utils/logger.js';

// Get all templates (admin)
export const getTemplates = async (req, res) => {
  try {
    const templates = await getAllTemplates();
    res.json({ 
      success: true, 
      data: templates 
    });
  } catch (error) {
    logger.error('Error fetching templates', { 
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get templates for specific user (based on access rights)
export const getUserTemplates = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    logger.debug('Fetching templates for user', { userId });

    // Get templates user has access to via service
    const templates = await getUserTemplatesFromService(userId);

    logger.info('Templates fetched successfully', {
      userId,
      count: templates.length
    });

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    logger.error('Error fetching user templates', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });

    // Handle "No templates available" case differently
    if (error.message === "No templates available for this user") {
      return res.json({
        success: true,
        data: [],
        message: 'No templates available for this user'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates'
    });
  }
};
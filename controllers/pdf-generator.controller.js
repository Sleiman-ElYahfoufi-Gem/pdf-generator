import { createPDF, generatePDFForUser } from "../services/pdf-generator.service.js";
import logger from "../utils/logger.js";
import { PAGES_FOLDER } from "../utils/constants.js";
export const generatePDF = async (req, res) => {
  try {
    const { username, email, country, description, templateId } = req.body;
    const userId = req.user.id;
    
    logger.debug('Generating PDF', { userId, templateId });
    
    // Service handles all business logic
    const { templatePath } = await generatePDFForUser(userId, templateId, {
      username,
      email,
      country,
      description
    });
    
    // Render the template using express-handlebars
    res.render(templatePath, { username, email, country, description, layout: false }, async (err, html) => {
      if (err) {
        logger.error('Error rendering template', { 
          error: err.message,
          stack: err.stack,
          templatePath,
          userId
        });
        return res.status(500).json({ 
          success: false,
          message: "Error rendering template" 
        });
      }

      // Generate PDF from the rendered HTML
      const pdfBuffer = await createPDF(html);
      
      logger.info('PDF generated successfully', { 
        userId, 
        templateId,
        size: pdfBuffer.length 
      });
      
      res.contentType("application/pdf");
      res.send(pdfBuffer);
    });

  } catch (error) {
    logger.error('Error generating PDF', { 
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    if (error.message === "You don't have access to this template") {
      return res.status(403).json({ 
        success: false,
        message: error.message 
      });
    }
    if (error.message === "Template not found") {
      return res.status(404).json({ 
        success: false,
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Error generating PDF" 
    });
  }
};

export const showPDFForm = async (req, res) => {
  try {
  
    res.render(`${PAGES_FOLDER}/pdf-form`);
  } catch (error) {
    logger.error('Error loading PDF form', { 
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
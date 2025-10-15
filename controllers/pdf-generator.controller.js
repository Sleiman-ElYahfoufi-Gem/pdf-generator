import { createPDF, generatePDFForUser, getUserTemplates } from "../services/pdf-generator.service.js";
import { PAGES_FOLDER } from "../utils/constants.js";
import logger from "../utils/logger.js";
export const generatePDF = async (req, res) => {
  try {
    const { username, email, country, description, templateId } = req.body;
    const userId = req.user.id;
    
    // Service handles all business logic
    const { templatePath, data } = await generatePDFForUser(userId, templateId, {
      username,
      email,
      country,
      description
    });
    
    // Render the template using express-handlebars
    res.render(templatePath, { username, email, country, description, layout: false }, async (err, html) => {
      if (err) {

        logger.error('Error rendering template:', { error: err });

        return res.status(500).json({ message: "Error rendering template" });
      }

      // Generate PDF from the rendered HTML
      const pdfBuffer = await createPDF(html);
      
      res.contentType("application/pdf");
      res.send(pdfBuffer);
    });

  } catch (error) {

        logger.error('Error generating PDF:', { error: err });

    
    if (error.message === "You don't have access to this template") {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === "Template not found") {
      return res.status(404).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Error generating PDF" });
  }
};

export const showPDFForm = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Service handles fetching templates
    const templates = await getUserTemplates(userId);
    
    // Just render the view with data
    res.render(`${PAGES_FOLDER}/pdf-form`, { templates });
  } catch (error) {

            logger.error('Error loading PDF form:', { error: err });

    res.status(500).json({ message: error.message });
  }
};
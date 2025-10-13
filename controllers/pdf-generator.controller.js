import { createPDF } from "../services/pdf-generator.service.js";

export const generatePDF = async (req, res) => {
  try {
    const { username, email,country,description } = req.body;
    
    // render the template using express-handlebars
    // render is for express-handlebars
    // uses pdf-template from the views to input data there with hbs
    // its configured in server.js
    res.render("pdf-template", { username, email, country, description, layout: false }, async (err, html) => {

      if (err) {
        console.error("Error rendering template:", err);
        return res.status(500).send("Error rendering template");
      }

      // generate PDF from the rendered HTML
      const pdfBuffer = await createPDF(html);
      
      res.contentType("application/pdf");
      res.send(pdfBuffer);
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};

export const showPDFForm = (req, res) => {
  res.render("pdf-form");
};
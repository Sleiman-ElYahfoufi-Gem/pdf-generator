import puppeteer from "puppeteer";
import * as templateRepository from "../repositories/template.repository.js";

export const createPDF = async (html) => {
  // Start puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Configure html content 
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });

  await browser.close();

  return pdfBuffer;
};

export const generatePDFForUser = async (userId, templateId, data) => {
  // Check if user has access to the selected template
  const hasAccess = await templateRepository.userHasAccessToTemplate(userId, templateId);
  
  if (!hasAccess) {
    throw new Error("You don't have access to this template");
  }
  
  // Get the template details
  const template = await templateRepository.getTemplateById(templateId);
  
  if (!template) {
    throw new Error("Template not found");
  }
  
  // Return template path for rendering
  return {
    templatePath: `templates/${template.src}`,
    templateName: template.name,
    data
  };
};

export const getUserTemplates = async (userId) => {
  // Get all templates the user has access to
  const templates = await templateRepository.getTemplatesForUser(userId);
  
  if (!templates || templates.length === 0) {
    throw new Error("No templates available for this user");
  }
  
  return templates;
};
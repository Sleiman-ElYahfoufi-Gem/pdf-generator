import express from "express";
import { generatePDF, showPDFForm } from "../controllers/pdf-generator.controller.js";
import { validatePDFGeneration } from "../validations/pdf-generator-validation.js";

const PDFRouter = express.Router();

PDFRouter.get("/pdf-form", showPDFForm);
// here we used a pipe, where in the validatepdfgeneration i have next, so it goes to the generatepdf
PDFRouter.post("/generate-pdf", validatePDFGeneration, generatePDF); 

export default PDFRouter;
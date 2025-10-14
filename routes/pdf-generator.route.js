import express from "express";
import { generatePDF, showPDFForm } from "../controllers/pdf-generator.controller.js";
import { validatePDFGeneration } from "../validations/pdf-generator.validation.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const PDFRouter = express.Router();

PDFRouter.get("/pdf-form", authenticateToken, showPDFForm);
PDFRouter.post("/generate-pdf", authenticateToken, validatePDFGeneration, generatePDF); 

export default PDFRouter;
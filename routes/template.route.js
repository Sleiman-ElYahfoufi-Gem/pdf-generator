import express from 'express';
import { getTemplates } from '../controllers/template.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const TemplateRouter = express.Router();

TemplateRouter.get('/', authenticateToken, getTemplates);

export default TemplateRouter;
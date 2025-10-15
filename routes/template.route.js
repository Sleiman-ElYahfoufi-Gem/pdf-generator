import express from 'express';
import { getTemplates,getUserTemplates } from '../controllers/template.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const TemplateRouter = express.Router();

TemplateRouter.get('/', authenticateToken, getTemplates);
TemplateRouter.get('/user', authenticateToken, getUserTemplates);

export default TemplateRouter;
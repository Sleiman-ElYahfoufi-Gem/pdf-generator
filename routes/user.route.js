import express from 'express';
import { getUsers } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const UserRouter = express.Router();

UserRouter.get('/', authenticateToken, getUsers);

export default UserRouter;
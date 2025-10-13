import express from 'express';
import { login, showLoginForm, logout } from '../controllers/auth.controller.js';
import { validateLogin } from '../validations/auth.validation.js';

const AuthRouter = express.Router();

AuthRouter.get("/login", showLoginForm);     
AuthRouter.post("/login", validateLogin, login);
AuthRouter.get("/logout", logout);

export default AuthRouter;
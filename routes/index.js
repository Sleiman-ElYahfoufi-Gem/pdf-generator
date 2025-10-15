import express from "express";
import PDFRouter from "./pdf-generator.route.js";
import AuthRouter from "./auth.route.js";
import TemplateRouter from "./template.route.js";
import UserRouter from "./user.route.js";

const Router = express.Router();

Router.use("/auth", AuthRouter);
Router.use("/pdf", PDFRouter);
Router.use("/templates",TemplateRouter)
Router.use("/users",UserRouter)
export default Router;
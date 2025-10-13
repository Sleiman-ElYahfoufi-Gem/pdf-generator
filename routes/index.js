import express from "express";
import PDFRouter from "./pdf-generator.route.js";
import AuthRouter from "./auth.route.js";

const Router = express.Router();

Router.use("/auth", AuthRouter);
Router.use("/pdf", PDFRouter);

export default Router;
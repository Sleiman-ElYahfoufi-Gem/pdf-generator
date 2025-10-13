import express from "express";
import PDFRouter from "./pdf-generator.route.js";

const Router = express.Router();

Router.use("/pdf", PDFRouter);

export default Router;
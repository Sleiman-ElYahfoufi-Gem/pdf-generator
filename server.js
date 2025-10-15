import express from "express";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser"; // ← Can remove if not using cookies elsewhere
import routes from "./routes/index.js";
import { engine } from "express-handlebars";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import logger from "./utils/logger.js";
import "./database/db.js"; // Import to test connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configure Handlebars
app.engine('hbs', engine({extname:'.hbs', defaultLayout: false}))
app.set("view engine", "hbs")
app.set("views","./views")

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser()); // ← Not needed for header-based auth (can remove)

// ⭐ CENTRALIZED LOGGER - Catches ALL requests (must be before routes)
app.use(loggerMiddleware);

// Routes
app.use("/api", routes)

// Start server
app.listen(PORT, () => {
  logger.info('Server started', { port: PORT });
  console.log(`Server is running on port: ${PORT}`);
});
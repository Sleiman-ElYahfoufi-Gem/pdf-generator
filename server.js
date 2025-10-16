import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { engine } from "express-handlebars";
import { loggerMiddleware } from "./middleware/logger.middleware.js";
import logger from "./utils/logger.js";
import { initializeSequelize } from "./database/config.js";
import { initializeModels } from "./models/index.js";
import { initializeCronJobs, startCronJobs, gracefulShutdown } from "./cron/index.js"; 

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

// CENTRALIZED LOGGER - Catches ALL requests
app.use(loggerMiddleware);

// Routes
app.use("/api", routes)

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, starting graceful shutdown...');
  await gracefulShutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, starting graceful shutdown...');
  await gracefulShutdown();
  process.exit(0);
});

// Start server
app.listen(PORT, async () => {
  logger.info('Server started', { port: PORT });
  logger.info(`Server is running on port: ${PORT}`);

  try {
    // Initialize Sequelize connection
    await initializeSequelize();

    // Initialize models and relationships
    await initializeModels();

    // Initialize and start cron jobs
    logger.info('🔧 Initializing cron jobs...');
    await initializeCronJobs();
    await startCronJobs();
    logger.info('Cron jobs started successfully');

  } catch (error) {
    logger.error('Failed to initialize server components', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
});
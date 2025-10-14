import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { engine } from "express-handlebars";
import "./database/db.js"; // Import to test connection
import { VIEWS_FOLDER } from "./utils/constants.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configure Handlebars
app.engine('hbs', engine({extname:'.hbs', defaultLayout: false}))
app.set("view engine", "hbs")
app.set("views", VIEWS_FOLDER)

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies (JWT stored in cookie)

// Routes
app.use("/api", routes)

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
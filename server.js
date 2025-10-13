import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { engine } from "express-handlebars";
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

// Routes
app.use("/api", routes)

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
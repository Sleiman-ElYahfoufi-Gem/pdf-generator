import express from "express";
import dotenv from "dotenv";
import session from "express-session";
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

// Session middleware
app.use(session({
  secret: process.env.JWT_SECRET, // Reusing JWT_SECRET for session
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false // Set to true in production with HTTPS
  }
}));

// Routes
app.use("/api", routes)

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
import express from "express";
import routes from "./routes/index.js"
import { engine } from "express-handlebars";


const app = express();
const PORT = 8080;
//configuring the handlebars engine with the views folder, so the render function can look in the views folder
app.engine('hbs', engine({extname:'.hbs',  defaultLayout: false}))
app.set("view engine", "hbs")
app.set("views","./views")
// here i parse json and form data 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api",routes)


app.listen(PORT, () => console.log("Server is running on port: " + PORT));


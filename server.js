
// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const routes = require("./routes/userRoutes");

// Initialize Express
const app = express();

// Set Dynamic Port
const PORT = process.env.PORT || 3000;

// Config Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Dynamic Mongo
let databaseUri = process.env.MONGODB_URI || "mongodb://localhost/leaflyScrape";

// Connect to Mongo
mongoose.connect(databaseUri);

// Config Handlebars
app.engine(
    "hbs",
    exphbs({
        defaultLayout: "main",
        extname: ".hbs"
    })
);
app.set("view engine", "hbs");

// Routes
app.use(routes);

// Start Server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});

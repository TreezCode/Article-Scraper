
// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");

// Initialize Express
const app = express();

// Set Dynamic Port
const PORT = process.env.PORT || 3000;

// Config Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Config Handlebars
app.engine(
    "hbs",
    exphbs({
        defaultLayout: "main",
        extname: ".hbs",
        layoutsDir: "views/layouts/"
    })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

// Routes
require("./routes/userRoutes")(app);

// Connect to Mongo Database
mongoose.connect("mongodb://localhost/Article-Scraper", { useNewUrlParser: true });

// Start Server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});

module.exports = app;

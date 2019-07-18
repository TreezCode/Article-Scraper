
// Dependencies
const cheerio = require("cheerio");
const axios = require("axios");
const router = require("express").Router();

// Require Models
const db = require("../models");

// Get all route
router.get("/", (req, res) => {
    // Meta tags sent to hbs
    res.locals.metaTags = {
        title: "Article Scraper • Home"
    }
    db.Article.find({ saved: false }).then((articles) => {
        res.render("index", { articles: articles })
    })
});

// Scrape Leafly website
router.get("/scrape", (req, res) => {
    // Meta tags sent to hbs
    res.locals.metaTags = {
        title: "Article Scraper • Scrape"
    }
    // Grab html body with axios
    axios.get("https://www.leafly.com/news/all").then((response) => {
        
        // Load response into cheerio and save as variable
        let $ = cheerio.load(response.data);

        // Iterate through each leafly article
        $("a.leafly-article").each((i, el) => {

            // Save empty result object
            let result = {};

            // Add the title, link and image as properties of the result object
            result.title = $(el).find(".leafly-title").text();
            result.link = $(el).attr("href");
            result.image = $(el).find("img").attr("src");
            result.byline = $(el).find(".leafly-byline").text();
            
            // console.log(result);
            
            // Create a new Article with the result object
            db.Article.create(result)
            .then((dbArticle) => {
                // Log result
                console.log(dbArticle);
                // Send result as json
                res.json(dbArticle);
            }).catch((err) => {
                // Log error
                console.log(err);
            });
        });

        // Send success message to client
        res.send("Scrape Complete")
    });
});

module.exports = router;

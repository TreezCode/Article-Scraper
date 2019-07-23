
// Dependencies
const cheerio = require("cheerio");
const axios = require("axios");
const router = require("express").Router();

// Require Models
const db = require("../models");

// Display home page
router.get("/", (req, res) => {

    // Meta tags sent to hbs
    res.locals.metaTags = {
        title: "Leafly Scraper • Browse"
    };
    db.Article.find({ saved: false }).sort({ _id: 1 }).then( articles => {
        res.render("index", { articles: articles })
    }).catch(err => {
        res.json(err);
    });
});

// Display saved articles
router.get("/saved", (req, res) => {

    // Meta tags sent to hbs
    res.locals.metaTags = {
        title: "Leafly Scraper • Saved"
    };
    db.Article.find({ saved: true }).sort({ _id: 1 }).populate("comment").then(articles => {
        res.render("saved", { articles: articles })
    }).catch(err => {
        res.json(err);
    });
})

// Save article
router.put("/saved/:id", (req, res) => {

    // Update article to "saved: true"
    db.Article.update({ _id: req.params.id }, { $set: { saved: req.body.saved }}, result => {
        res.status(200).json({ message: "Saved Status Changed" });
    });
});

// Unsave article
router.put("/unsaved/:id", (req, res) => {

    // Update article to "saved: false"
    db.Article.update({ _id: req.params.id }, { $set: { saved: req.body.saved }}, result => {
        res.status(200).json({ message: "Saved Status Changed" });
    });
});

// Comment on article
router.post("/comment", (req, res) => {

    // Useful test/debug
    // console.log(req.body);
    
    // Create comment with form data then update article with the created comment
    db.Comment.create({ commentText: req.body.comment }).then(dbComment => {
        return db.Article.findOneAndUpdate({ _id: req.body.id }, { $push: { comment: dbComment._id } }, { new: true });
    }).then(dbArticle => {
        // Redirect to saved page after article is updated with comment
        res.status(200).redirect("/saved");
    }).catch(err =>{
        res.json(err);
    });
});

// Delete comment
router.delete("/delete/:id" , (req, res) => {

    // Find comment by _id and delete from db
    db.Comment.deleteOne({ _id: req.params.id }).then(dbComment => {
        // Redirect to saved page after comment is deleted
        res.status(200).redirect("/saved");
    }).catch(err => {
        res.json(err);
    });
})


// Scrape All articles
router.get("/scrape", (req, res) => {

    // Grab html body with axios
    axios.get("https://www.leafly.com/news/all").then(response => {
        
        // Load response into cheerio and save as variable
        let $ = cheerio.load(response.data);
        
        // Iterate through each leafly article
        $("a.leafly-article").each((i, el) => {

            // Save empty result object
            let result = {};

            // Add the title, link, image, ect. as properties of the result object
            result.title = $(el).find(".leafly-title").text();
            result.link = $(el).attr("href");
            result.image = $(el).find("img").attr("src");
            result.summary = $(el).find(".leafly-excerpt").text();
            result.byline = $(el).find(".leafly-byline").text();
            
            let title = result.title;

            // Check if article already exists in db to avoid duplicate articles
            db.Article.find({ title }).then(data => {
                if (data.length === 0) {
                    // Create a new Article with the result object
                    db.Article.create(result).then( dbArticle => {
                    }).catch(err => {
                        res.json(err);
                    });
                }
            }).catch(err => {
                res.json(err);
            });
        });
        // Redirect to home page
        res.status(200).redirect("/");
    });
});

// Scrape Science articles
router.get("/scrapeScience", (req, res) => {

    // Grab html body with axios
    axios.get("https://www.leafly.com/news/category/science-tech").then(response => {
        
        // Load response into cheerio and save as variable
        let $ = cheerio.load(response.data);
        
        // Iterate through each leafly article
        $("a.leafly-article").each((i, el) => {

            // Save empty result object
            let result = {};

            // Add the title, link, image, ect. as properties of the result object
            result.title = $(el).find(".leafly-title").text();
            result.link = $(el).attr("href");
            result.image = $(el).find("img").attr("src");
            result.summary = $(el).find(".leafly-excerpt").text();
            result.byline = $(el).find(".leafly-byline").text();
            
            let title = result.title;

            // Check if article already exists in db to avoid duplicate articles
            db.Article.find({ title }).then(data => {
                if (data.length === 0) {
                    // Create a new Article with the result object
                    db.Article.create(result).then( dbArticle => {
                    }).catch(err => {
                        res.json(err);
                    });
                }
            }).catch(err => {
                res.json(err);
            });
        });
        // Redirect to home page
        res.status(200).redirect("/");
    });
});

// Scrape Health articles
router.get("/scrapeHealth", (req, res) => {

    // Grab html body with axios
    axios.get("https://www.leafly.com/news/category/health").then(response => {
        
        // Load response into cheerio and save as variable
        let $ = cheerio.load(response.data);
        
        // Iterate through each leafly article
        $("a.leafly-article").each((i, el) => {

            // Save empty result object
            let result = {};

            // Add the title, link, image, ect. as properties of the result object
            result.title = $(el).find(".leafly-title").text();
            result.link = $(el).attr("href");
            result.image = $(el).find("img").attr("src");
            result.summary = $(el).find(".leafly-excerpt").text();
            result.byline = $(el).find(".leafly-byline").text();
            
            let title = result.title;

            // Check if article already exists in db to avoid duplicate articles
            db.Article.find({ title }).then(data => {
                if (data.length === 0) {
                    // Create a new Article with the result object
                    db.Article.create(result).then( dbArticle => {
                    }).catch(err => {
                        res.json(err);
                    });
                }
            }).catch(err => {
                res.json(err);
            });
        });
        // Redirect to home page
        res.status(200).redirect("/");
    });
});

// Scrape Cannabis 101 articles
router.get("/scrape101", (req, res) => {

    // Grab html body with axios
    axios.get("https://www.leafly.com/news/category/cannabis-101").then(response => {
        
        // Load response into cheerio and save as variable
        let $ = cheerio.load(response.data);
        
        // Iterate through each leafly article
        $("a.leafly-article").each((i, el) => {

            // Save empty result object
            let result = {};

            // Add the title, link, image, ect. as properties of the result object
            result.title = $(el).find(".leafly-title").text();
            result.link = $(el).attr("href");
            result.image = $(el).find("img").attr("src");
            result.summary = $(el).find(".leafly-excerpt").text();
            result.byline = $(el).find(".leafly-byline").text();
            
            let title = result.title;

            // Check if article already exists in db to avoid duplicate articles
            db.Article.find({ title }).then(data => {
                if (data.length === 0) {
                    // Create a new Article with the result object
                    db.Article.create(result).then( dbArticle => {
                    }).catch(err => {
                        res.json(err);
                    });
                }
            }).catch(err => {
                res.json(err);
            });
        });
        // Redirect to home page
        res.status(200).redirect("/");
    });
});


// Clear all articles from db
router.get("/clear", (req, res) => {

    db.Article.deleteMany({}).then(data => {
        // Redirect to home page after db is cleared
        res.status(200).redirect("/");
    }).catch(err => {
        res.json(err);
    });
});

module.exports = router;

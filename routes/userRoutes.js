
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
    db.Article.find({ saved: false }).then( articles => {
        res.render("index", { articles: articles })
    });
});

// Display saved articles
router.get("/saved", (req, res) => {

    // Meta tags sent to hbs
    res.locals.metaTags = {
        title: "Leafly Scraper • Saved"
    };
    db.Article.find({ saved: true }).populate("comment").then(articles => {
        res.render("saved", { articles: articles })
    }).catch((err) => {
        console.log(err);
    });
})

// Save article
router.put("/saved/:id", (req, res) => {

    // Save request id
    let id = req.params.id;

    // Update article to "saved: true" in Mongo
    db.Article.update({ _id: id }, { $set: { saved: req.body.saved }}, result => {
        res.status(200).json({ message: "Saved Status Changed" });
    });
});

// // Display comments for article
// router.get("/comment/:id", (req, res) => {

//     db.Article.findOne({ _id: req.params.id }).populate("comment").then(dbArticle => {
//         res.status(200).render("saved");
//     }).catch(err => {
//         console.log(err);
//         res.json(err);
//     });
// });

// Comment on article
router.post("/comment", (req, res) => {

    // Useful test/debug
    // console.log(req.body);
    
    // Create comment with form data then update article with the created comment
    db.Comment.create({ commentText: req.body.comment }).then(dbComment => {
        console.log("dbComment: ", dbComment);
        return db.Article.findOneAndUpdate({ _id: req.body.id }, { $push: { comment: dbComment._id } }, {new: true});
    }).then(dbArticle => {
        console.log("dbArticle:", dbArticle);
        res.status(200).redirect("/saved");
    }).catch(err =>{
        console.log(err);
        res.json(err);
    });
});


// Scrape Leafly website
router.get("/scrape", (req, res) => {

    // Grab html body with axios
    axios.get("https://www.leafly.com/news/all").then(response => {
        
        // Load response into cheerio and save as variable
        let $ = cheerio.load(response.data);

        // Save total number of articles
        let count = $("a.leafly-article").length;
        let total = $("a.leafly-article").length;
        
        // Iterate through each leafly article
        $("a.leafly-article").each((i, el) => {

            // Save empty result object
            let result = {};

            // Add the title, link and image as properties of the result object
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
                        // console.log(dbArticle);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        });

        // Redirect back to home page
        res.redirect("/")
    });
});

// Clear all articles from db
router.get("/clear", (req, res) => {
    db.Article.deleteMany({}).then(data => {
        // Redirect back to home page
        res.redirect("/");
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router;

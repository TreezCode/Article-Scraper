# Article-Scraper

Demo: [Leafly Scraper](https://leafly-scraper-treez.herokuapp.com/)
## About 📖
Leafly Scraper is a web app that utilizes Mongoose and Cheerio to *scrape* news articles from Leafly.com and handlebars to render them to the HTML. The users are then able to view, save and comment on the latest Leafly news.

## How to Use 🤔

The user is greeted with an elegant interface upon visiting the deployed heroku domain.

<img src= "public/img/leaflyScrape.png" alt="Leafly Scraper" width="100%">

By clicking on the *Scrape Articles* button, the web app will retrieve 10 of the latest news articles from Leafly and display them to the user. The user then has the option to view or save an article.

If the user decides to save an article, that particular article will be pushed to the *Saved Page* where the they are able to view and comment on any of the saved articles.

## How it Works 🔨

**Model View Controller**

This application is formatted in a basic MVC style for organized modulization.

```
.
├── models
│   ├── Article.js
│   ├── Comment.js
│   └── index.js
│     
├── node_modules
│
├── public
│   └── assets
│       ├── css
│       │   └── style.css
│       ├── img
│       │   └── example.png
│       └── js
│           └── app.js
│
├── routes
│   └─── userRoutes.js   
│
├── views
│   ├── index.hbs
│   ├── saved.hbs
│   ├── 404.hbs
│   └── layouts
│       └── main.handlebars
│
├── package.json
│
└── server.js
```

**Main Functionality**

The app's main function is initialized when the user clicks *Scrape Articles*, which will hit a GET route to retrieve data using *Axios* and *Cheerio*: 

```
axios.get("https://www.leafly.com/news/all").then(response => {
    
    // Load response into cheerio and save as variable
    let $ = cheerio.load(response.data);
    
    // Iterate through each leafly article
    $("a.leafly-article").each((i, el) => {
```

The data is saved as a "result" object, which is then used to create a *Collection* in MongoDB using *Mongoose*:

```
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
```

Once we have a collection of *Documents* in our database, we are able to display them to the user dependent on certain properties:

```
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
```

## Pre-Requisites ✔️

To power this app locally, you'll need to a install a couple `NPM Packages`. Downloading the following Node packages is crucial for this applications functionality.

* Axios `npm install axios`
* Cheerio `npm install cheerio`
* Express `npm install express`
* Express-Handlebars `npm install express-handlebars`
* Mongoose `npm install mongoose`

OR

* Shorthand `npm i`

## Getting Started Locally🏁

The following steps will get you a copy of the application up and running on your local machine for testing and grading puproses.

1. Copy this repository from github by using clone.
2. Git clone repository in IDE of choice
3. Navigate to proper directory in IDE
4. If all pre-requisites are met, initalize the app by typing the command `node server.js`
5. Vist your local host and chosen port in your browser and ENJOY!

**REMEMBER**

You will also need to create a Mongo database environment for the article data to live in.

Be sure to have *MONGOD* running in your terminal if you are attempting a local connection.

## Technologies Used 💻

* Axios
* Cheerio
* CSS3
* Express
* Express-Handlebars
* HTML5
* Javascript ES6
* MongoDB
* Mongoose
* Node.js
* VS Code

## Creator ✋

**Joey Kubalak**

AKA 

👇

*Treez* 🌲

Github profile 👉 [TreezCode](https://github.com/TreezCode)

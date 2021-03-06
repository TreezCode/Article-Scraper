
// Dependencies
const mongoose = require("mongoose");

// Save reference to Schema constructor
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    summary: {
        type:String,
        required: true
    },
    byline: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    // Create "comment" obj to store the Comment id
    // The ref property links the ObjectId to the Comment model
    // This allows us to populate the Article with an associated Comment
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

// Create model from schema using mongoose's model method
let Article = mongoose.model("Article", ArticleSchema);

// Export Article
module.exports = Article;


// Dependencies
const mongoose = require("mongoose");

// Reference to Schema constructor
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    commentText: {
        type: String,
        required: true
    }
});

// Create model from schema using mongoose's model method
let Comment = mongoose.model("Comment", CommentSchema);

// Export Comment
module.exports = Comment;
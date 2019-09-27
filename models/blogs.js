var mongoose = require("mongoose");


// Schema Setup
var blogSchema = new mongoose.Schema({
    name: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


// exporting blog schema
module.exports = mongoose.model("Blog", blogSchema);


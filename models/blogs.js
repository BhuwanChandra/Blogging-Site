const mongoose = require("mongoose");


// Schema Setup
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
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


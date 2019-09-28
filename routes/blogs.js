var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var middleware = require('../middleware');

// INDEX - display all blogs in DB
router.get('/', function (req, res) {
    // Get all blogs from DB
    Blog.find({}, function (err, blog) {
        if (err) {
            console.log(err);

        } else {
            res.render('blogs/index', { blogs: blog });

        }
    })
});

// CREATE - add new Blog to DB
router.post("/", middleware.isLoggedIn, function (req, res) {

    // get data from form and add to blogs array
    var title = req.body.title;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBlog = { title: title, image: image, description: desc, author: author };

    //blogs.push(newBlog);
    // Create a new Blog and save to DB
    Blog.create(newBlog, function (err, blog) {
        if (err) {
            console.log(err);

        } else {
            // redirect back to blogs page
            res.redirect("/blogs");
        }
    })

});

// NEW - show form to add new Blog
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("blogs/new");
});




module.exports = router;
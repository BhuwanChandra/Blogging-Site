var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");
var expressSanitizer = require('express-sanitizer');
var middleware = require('../middlewares');

router.use(expressSanitizer());

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
    var desc = req.sanitize(req.body.description);
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

// SHOW - show information of a particular Blog
router.get("/:id", function (req, res) {
    // find the Blog with provided id
    Blog.findById(req.params.id).populate("comments").exec(function (err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            // render show template related to that id
            res.render("blogs/show", { blog: foundBlog });
        }
    });
});

// EDIT BLOG ROUTE
router.get("/:id/edit", middleware.checkBlogAuthor, function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        res.render("blogs/edit", { blog: foundBlog });
    })
})
// UPDATE BLOG ROUTE
router.put("/:id", middleware.checkBlogAuthor, function (req, res) {
    // find and update the correct blog
    req.body.blog.description = req.sanitize(req.body.blog.description);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            // redirect somewhere(show page)
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

// DESTROY BLOG ROUTE
router.delete("/:id", middleware.checkBlogAuthor, function (req, res) {
    Blog.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})

module.exports = router;
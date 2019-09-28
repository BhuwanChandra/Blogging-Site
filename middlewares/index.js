var Blog = require('../models/blog');
var Comment = require('../models/comment');

// All the middlewares are goes here
var middlewareObj = {};

middlewareObj.checkBlogAuthor = function (req, res, next) {
    // check is user logged in ?
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id, function (err, foundBlog) {
            if (err) {
                req.flash('error', 'Blog not found');
                res.redirect("/blogs");
            } else {
                //does user own the Blog
                if (foundBlog.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that!!");
                    // otherwise, redirect
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash('error', 'You Need To Be Logged In To Do That!!!');
        // if not , redirect
        res.redirect("back");
    }
};

middlewareObj.checkCommentAuthor = function (req, res, next) {
    // check is user logged in ?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                //does user own the Blog
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    // otherwise, redirect
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash('error', 'You Need To Be Logged In To Do That!!!');
        // if not , redirect
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', "Please Login First!");
    res.redirect("/login");
}

module.exports = middlewareObj;

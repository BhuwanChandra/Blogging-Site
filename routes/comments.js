var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blogs");
var Comment = require("../models/comment");
var middleware = require("../middlewares");

// comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    // find blog by id
    Blog.findById(req.params.id, function (err, camp) {
        if (err) {
            console.log(err);

        } else {

            res.render("comments/new", { blog: camp });
        }
    })
})

// comments create
router.post("/", middleware.isLoggedIn, function (req, res) {
    // lookup blog using ID
    Blog.findById(req.params.id, function (err, blog) {
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            // create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                    req.flash('error', 'Something went wrong');
                } else {
                    // add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();

                    // connect new comment to blog
                    blog.comments.push(comment);
                    blog.save();
                    req.flash('success', 'Successfully added comment!!!');
                    // redirect to blog show page
                    res.redirect("/blogs/" + blog._id);
                }
            })
        }
    })
})

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentAuthor,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', { blog_id: req.params.id, comment: foundComment });
        }
    })
})

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentAuthor,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect('back');
        } else {
            res.redirect("/blogs/"+ req.params.id);
        }
    })
})

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentAuthor,function(req, res){
    // Find by Id and delete the comment
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment is deleted!!!');
            // redirect to show page
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

module.exports = router;
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Blog = require("../models/blogs");

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

// AUTH ROUTES ====================

// show register form
router.get("/register", function (req, res) {
    res.render('register');
})
// handle signup logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash('error', err.message);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function () {
            req.flash('success', 'Welcome to Blogger.tech platform ' + user.username);
            res.redirect("/");
        })
    })
})

// show login form
router.get("/login", function (req, res) {
    res.render("login")
})
// handle login logic  //  we use middleware to login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function (req, res) {
})

// Logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash('success', "Successfully Logged You Out!!!")
    res.redirect("/");
})

module.exports = router;
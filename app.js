var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require('connect-flash');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Blog = require("./models/blog");
var Comment = require("./models/comment");
var User = require("./models/user");

// Requiring route files
var commentRoutes = require("./routes/comments"),
    blogRoutes = require('./routes/blogs'),
    indexRoutes = require('./routes/index');

mongoose.connect("mongodb://localhost/blogSite", { useNewUrlParser: true });

// tell express to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

app.use(flash());

// PASSPORT CONFIGURATION
// using express-session to create sessions
app.use(require("express-session")({
    secret: "This is Blogging site",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// send the logged in user's info to every page that is -
// - call the function below on every single route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use("/",indexRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use('/blogs',blogRoutes);

app.listen(1234,function(){
    console.log("The BlogSite Server Has Started on the port 1234 !!");
});


const express = require("express");
const app = express();
const expressSanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const Blog = require("./models/blogs");
const Comment = require("./models/comment");
const User = require("./models/user");

const PORT = process.env.PORT || 7000;
const { MONGO_URI } = require("./config/keys"); 

// Requiring route files
const commentRoutes = require("./routes/comments"),
  blogRoutes = require("./routes/blogs"),
  indexRoutes = require("./routes/index");

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).catch(err => console.log(err));

// tell express to use body-parser
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.use(expressSanitizer());

app.use(methodOverride("_method"));

app.use(flash());

// using express-session to create sessions
app.use(
  require("express-session")({
    secret: "This is Blogging site",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// send the logged in user's info to every page that is -
// - call the function below on every single route
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/blogs/:uid/:id/comments", commentRoutes);
app.use("/blogs", blogRoutes);

app.get("*",(req, res) => {
    res.render("error");
});

app.listen(PORT, function() {
  console.log(
    `The BlogSite Server Has Started on the port ${PORT} !!`
  );
});

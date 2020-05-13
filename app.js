/* App initialization */

var express = require("express"),
    app = express(),
    bp = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    ppLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user");

/* 
    App configuration 
*/

mongoose.connect("mongodb://localhost/sportsfeedapp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(require("express-session")({
    secret: "IS THIS THE DAGGER?! OHHH",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bp.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
/*
    ROUTE SETUP
*/

app.get("/", function(req, res){
    res.render("landing");
});
app.get("/error", function(req, res){
    res.render("error");
});

var feedRoutes = require("./routes/feed");
var searchRoutes = require("./routes/search");
var authRoutes = require("./routes/auth");

app.use(feedRoutes);
app.use(searchRoutes);
app.use(authRoutes);

app.listen(3000, function(){
    console.log("Sportfeed server initiated...")
});
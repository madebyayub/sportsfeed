/*
    Variable Declaration
*/
var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

/*
    Login Routes
*/

router.get("/login", function(req, res){
    res.render("auth/login");
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/user/v/feed",
    failureRedirect: "/login",
}));

/*
    Logout Route
*/
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("back");
});

/*
    Register Routes
*/

router.get("/register", function(req, res){
    res.render("auth/register");
});
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err)
            return res.render("auth/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
    });
});

module.exports = router;
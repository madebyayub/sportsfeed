/*
    Variable Declaration
*/
var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    middleWare = require("../middleware");

/*
    Login Routes
*/
router.use( function( req, res, next ) {
    // this middleware will call for each requested
    // and we checked for the requested query properties
    // if _method was existed
    // then we know, clients need to call DELETE request instead
    if ( req.query._method == 'PUT' ) {
        // change the original METHOD
        // into DELETE method
        req.method = 'PUT';
        // and set requested url to /user/12
        req.url = req.path;
    }       
    next(); 
});

router.get("/login", function(req, res){
    if (req.isAuthenticated()){
        res.redirect("back");
    }else{
        res.render("auth/login");
    }
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/user/a/feed",
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

/*
    Follow Routes
*/
router.put("/:sport/:team/follow", middleWare.isLoggedIn, function(req, res){
    var user = req.user;
    user.followed.push({sport:req.params.sport, teamname:req.params.team});
    User.findByIdAndUpdate(req.user, user, function(err, user){
        if (err){
            res.redirect("/error");
        }else{
            res.redirect("back");
        }
    });
});
router.put("/:sport/:team/unfollow", middleWare.isLoggedIn, function(req, res){
    var temp_user = req.user;
    for (var i = 0; i < req.user.followed.length; i++){
        if (req.user.followed[i].teamname.toLowerCase() == req.params.team.toLowerCase()){
            temp_user.followed.splice(i, 1);
            break;
        }
    }
    User.findByIdAndUpdate(req.user, temp_user, function(err, user){
        if (err){
            res.redirect("/error");
        }else{
            res.redirect("back");
        }
    });
});
module.exports = router;
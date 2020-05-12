var express = require("express"),
    router = express.Router();

router.get("/:sport/search", function(req, res){
    if (["NFL", "NHL", "NBA", "MLB"].indexOf(req.params.sport.toUpperCase()) >= 0){
        res.render("search/search", {sport: req.params.sport});
    }else{
        res.redirect("/error");
    }
});

module.exports = router;
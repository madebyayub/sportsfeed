var express = require("express"),
  router = express.Router();
/*
    GET ROUTE
    -----------------------------
    This route renders the search functionality within the application to navigate from one team's results
    to another team's results.
*/
router.get("/:sport/search", function (req, res) {
  if (["NFL", "NHL", "NBA"].indexOf(req.params.sport.toUpperCase()) >= 0) {
    res.render("search/search", { sport: req.params.sport });
  } else {
    res.redirect("/error");
  }
});

module.exports = router;

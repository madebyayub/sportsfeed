/* App initialization */
var express = require("express"),
    app = express(),
    bp = require("body-parser");
var feedRoutes = require("./routes/feed");
var searchRoutes = require("./routes/search");

/* App configuration */
app.set("view engine", "ejs");
app.use(bp.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

/* Sport teams array */

app.get("/", function(req, res){
    res.render("landing");
});

app.use(feedRoutes);
app.use(searchRoutes);

app.listen(3000, function(){
    console.log("Sportfeed server initiated...")
});
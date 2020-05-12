var express = require("express"),
    router = express.Router(),
    request = require("request");


var nba = [
    "atlanta hawks", "boston Celtics", "brooklyn nets", "charlotte hornets",
    "chicago bulls", "cleveland cavaliers", "dallas mavericks", "denver nuggets",
    "detroit pistons", "golden state warriors", "houston rockets", "indiana pacers",
    "los angeles clippers", "los angeles lakers","memphis grizzlies","miami heat",
    "milwaukee bucks","minnesota timberwolves","new orleans pelicans","new york knicks",
    "oklahoma city thunder","orlando magic","philadelphia 76ers","phoenix suns","portland trail blazers",
    "sacramento kings","san antonio spurs","toronto raptors","utah jazz","washington wizards", "nba"
]

router.get("/:sport/feed/:type/:team", async function(req, res){
    if (["NFL", "NHL", "NBA", "MLB"].indexOf(req.params.sport.toUpperCase()) >= 0){
        if (containsIn(req.params.sport, req.params.team)){
            // get articles from LEAGUE SITE, ESPN, BLEACHERREPORT, YAHOO SPORTS!
            var teamNames = req.params.team.split(" ");
            var teamName = "";
            teamNames.forEach(name => teamName = teamName + "+" + name + " ");
            if (req.params.type.toLowerCase() === "a"){
                var espn = await getESPNArticles(teamName);
                var br = await getBRArticles(teamName);
                res.render("feed/articlefeed", {sport: req.params.sport, team: req.params.team, brArticles: br.articles, espnArticles: espn.articles});
            }else if (req.params.type.toLowerCase() === "v"){
                var espn = await getESPNVideos(teamName);
                res.render("feed/videofeed", {sport: req.params.sport, team: req.params.team, espnVideos: espn.results[0].contents});
            }else{
                res.redirect("/error");
            }
        }else{
            res.redirect("/error");
        }
    }else{
        res.redirect("/error");
    }
});

function getESPNVideos(teamName){
    return new Promise((resolve, reject) => {
        request("https://site.web.api.espn.com/apis/search/v2"+
                "?region=us&lang=en&limit=50&page=1&type=clips"+
                "&iapPackages=ESPN_PLUS%2CESPN_PLUS_MLB%2CESPN_PLUS_UFC_PPV_249"+
                "&dtciVideoSearch=true&query=" + teamName, function(error, response, body){
                if(!error && response.statusCode == 200){
                    parsedBody = JSON.parse(body);
                    return resolve(parsedBody);
                }else{
                    return reject(null);
                }
        });
    });
}

function getESPNArticles(teamName){
    return new Promise((resolve, reject) => {
        request("https://newsapi.org/v2/everything?q="+teamName+
                "&sources=espn&domains=espn.com"+
                "&apiKey=a02d4676a3394acebe3f2ca3a4d073e3", function(error, response, body){
                if(!error && response.statusCode == 200){
                    parsedBody = JSON.parse(body);
                    return resolve(parsedBody);
                }else{
                    return reject(null);
                }
        });
    });
}

function getBRArticles(teamName){
    return new Promise((resolve, reject) => {
        request("https://newsapi.org/v2/everything?q="+teamName+
                "&sources=bleacher-report&domains=bleacherreport.com"+
                "&apiKey=a02d4676a3394acebe3f2ca3a4d073e3", function(error, response, body){
                if(!error && response.statusCode == 200){
                    parsedBody = JSON.parse(body);
                    return resolve(parsedBody);
                }else{
                    return reject(null);
                }
        });
    });
}

function containsIn(sport, team){
    if (sport.toLowerCase() == "nba"){
        if(nba.indexOf(team.toLowerCase()) >= 0){
            return true;
        }else{
            return false;
        }
    }
}

module.exports = router;
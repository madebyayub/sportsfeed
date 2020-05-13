var express = require("express"),
    router = express.Router(),
    request = require("request"),
    middleWare = require("../middleware");

var APIkey = "AIzaSyBMti91-v5LJmH4_l4LWQTavnp8Td2WS88";
var nba = [
    "atlanta hawks", "boston Celtics", "brooklyn nets", "charlotte hornets",
    "chicago bulls", "cleveland cavaliers", "dallas mavericks", "denver nuggets",
    "detroit pistons", "golden state warriors", "houston rockets", "indiana pacers",
    "los angeles clippers", "los angeles lakers","memphis grizzlies","miami heat",
    "milwaukee bucks","minnesota timberwolves","new orleans pelicans","new york knicks",
    "oklahoma city thunder","orlando magic","philadelphia 76ers","phoenix suns","portland trail blazers",
    "sacramento kings","san antonio spurs","toronto raptors","utah jazz","washington wizards", "nba"
]
var channelIDs = {
    espn: "UCiWLfSweyRNmLpgEHekhoAg",
    nba: "UCWJ2lWNubArHWmf3FIHbfcQ",
    undisputed: "UCLXzq85ijg2LwJWFrz4pkmw"
};

router.get("/:sport/feed/:type/:team", async function(req, res){
    if (["NFL", "NHL", "NBA", "MLB"].indexOf(req.params.sport.toUpperCase()) >= 0){
        if (containsIn(req.params.sport, req.params.team)){
            // get articles from LEAGUE SITE, ESPN, BLEACHERREPORT, YAHOO SPORTS!
            var teamNames = req.params.team.split(" ");
            var teamName = "";
            teamNames.forEach(name => teamName = teamName + "+" + name + " ");
            if (req.params.type.toLowerCase() === "a"){
                var espn = await getArticles("espn", "espn.com", teamName);
                var br = await getArticles("bleacher-report", "bleacherreport.com", teamName);
                var fox = await getArticles("fox-sports", "foxsports.com", teamName);
                res.render("feed/articlefeed", {sport: req.params.sport, team: req.params.team, 
                    brArticles: br.articles, espnArticles: espn.articles, 
                    foxArticles: fox.articles, cbcArticles: null});
            }else if (req.params.type.toLowerCase() === "v"){
                var espn = await getVideos(teamName, channelIDs.espn, "espn", APIkey);
                var undisputed = await getVideos(teamName, channelIDs.undisputed, "undisputed", APIkey);
                var nba = await getVideos(teamName, channelIDs.nba, "nba.com", APIkey);
                res.render("feed/videofeed", {sport: req.params.sport, team: req.params.team, 
                    espnVideos: espn.items, undisputedVideos: undisputed.items, nbaVideos: nba.items});
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

router.get("/user/feed", middleWare.isLoggedIn, function(req, res){
    res.send("feed page");
});

function getVideos(teamName, channelID, channel, APIkey){
    return new Promise((resolve, reject) => {
        request("https://www.googleapis.com/youtube/v3/search?"+
                "part=snippet&type=video&key="+APIkey+"&channelId="+channelID+
                "&maxResults=50&order=relevance&q="+channel+" "+teamName, 
                function(error, response, body){
                    if(!error && response.statusCode == 200){
                        parsedBody = JSON.parse(body);
                        return resolve(parsedBody);
                    }else{
                        return reject(null);
                    }
        });
    });
}

function getArticles(source, domain, teamName){
    return new Promise((resolve, reject) => {
        request("https://newsapi.org/v2/everything?q="+teamName+
                "&sources="+source+"&domains="+domain+
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
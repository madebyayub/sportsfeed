var express = require("express"),
    router = express.Router(),
    request = require("request"),
    middleWare = require("../middleware");


var APIkeys = ["AIzaSyBMti91-v5LJmH4_l4LWQTavnp8Td2WS88", "AIzaSyCNnBq_3ON2s50n0b5Wf8ugoeD_323HWx8"];
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
    undisputed: "UCLXzq85ijg2LwJWFrz4pkmw",
    br: "UC9-OpMMVoNP5o10_Iyq7Ndw"
};

router.get("/:sport/feed/:type/:team", async function(req, res){
    if (["nfl", "nhl", "nba", "mlb"].indexOf(req.params.sport.toLowerCase()) >= 0){
        if (containsIn(req.params.sport, req.params.team)){
            var sport = req.params.sport.toLowerCase();
            var teamNames = req.params.team.split(" ");
            var teamName = "";
            teamNames.forEach(name => teamName = teamName + "+" + name + " ");
            if (sport === "nba"){
                if (req.params.type.toLowerCase() === "a"){
                    var espn = await getArticles("espn", "espn.com", teamName);
                    var br = await getArticles("bleacher-report", "bleacherreport.com", teamName);
                    var fox = await getArticles("fox-sports", "foxsports.com", teamName);
                    res.render("feed/articles/nba", {sport: req.params.sport, team: req.params.team, 
                        brArticles: br.articles, espnArticles: espn.articles, 
                        foxArticles: fox.articles, cbcArticles: null});
                }else if (req.params.type.toLowerCase() === "v"){
                    // ESPN YOUTUBE QUERY FETCH
                    try{
                        var espn = await getVideos(teamName, channelIDs.espn, "espn", APIkeys[1]);
                    }catch{
                        var espn = await getVideos(teamName, channelIDs.espn, "espn", APIkeys[0]);
                    }
                    // UNDISPUTED
                    try{
                        var undisputed = await getVideos(teamName, channelIDs.undisputed, "undisputed", APIkeys[1]);
                    }catch{
                        var undisputed = await getVideos(teamName, channelIDs.undisputed, "undisputed", APIkeys[0]);
                    }
                    // NBA
                    try{
                        var nba = await getVideos(teamName, channelIDs.nba, "nba.com", APIkeys[1]);
                    }catch{
                        var nba = await getVideos(teamName, channelIDs.nba, "nba.com", APIkeys[0]);
                    }
                    // BLEACHERREPORT
                    try{
                        var br = await getVideos(teamName, channelIDs.br, "bleacherreport", APIkeys[1])
                    }catch{
                        var br = await getVideos(teamName, channelIDs.br, "bleacherreport", APIkeys[0])
                    }
                    res.render("feed/videos/nba", {sport: req.params.sport, team: req.params.team, 
                        espnVideos: espn.items, undisputedVideos: undisputed.items, nbaVideos: nba.items, brVideos: br.items});
                }else{
                    res.redirect("/error");
                }
            }else if(sport === "nfl"){

            }else if(sport === "nhl"){

            }else{

            }
        }else{
            res.redirect("/error");
        }
    }else{
        res.redirect("/error");
    }
});

router.get("/user/:type/feed", middleWare.isLoggedIn, async function(req, res){
    if (req.params.type.toLowerCase() === "a"){
        var follow_feed = [];
        var results;
        for (var i = 0; i < req.user.followed.length; i++){
            var article = {label: req.user.followed[i].sport + " / " + req.user.followed[i].teamname, articles: []};
            if (req.user.followed[i].sport.toLowerCase() === "nba"){
                results = await getArticles("espn, bleacher-report", "espn.com, bleacherreport.com", req.user.followed[i].teamname);
                article.articles = results.articles;
                follow_feed.push(article)
            }
        }
        //console.log(follow_feed[0].articles);
        res.render("feed/user/article", {sport: "feed", result: follow_feed});
    }else if(req.params.type.toLowerCase() === "v"){
        var follow_feed = [];
        var results;
        for (var i = 0; i < req.user.followed.length; i++){
            var video = {label: req.user.followed[i].sport + " / " + req.user.followed[i].teamname, videos: []};
            try{
                results = await getAllVideos(req.user.followed[i].teamname, APIkeys[0]);
            }catch{
                results = await getAllVideos(req.user.followed[i].teamname, APIkeys[1]);
            }
            video.videos = results.items;
            follow_feed.push(video);
        }
        res.render("feed/user/video", {sport: "feed", result: follow_feed});
    }else{
        res.redirect("/error");
    }

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

function getAllVideos(teamName, APIkey){
    return new Promise((resolve, reject) => {
        request("https://www.googleapis.com/youtube/v3/search?"+
                "part=snippet&type=video&key="+APIkey+
                "&maxResults=50&order=relevance&q="+teamName, 
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
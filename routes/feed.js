var express = require("express"),
    router = express.Router();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('a02d4676a3394acebe3f2ca3a4d073e3');

var nba = [
    "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets",
    "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets",
    "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers",
    "Los Angeles Clippers", "Los Angeles Lakers","Memphis Grizzlies","Miami Heat",
    "Milwaukee Bucks","Minnesota Timberwolves","New Orleans Pelicans","New York Knicks",
    "Oklahoma City Thunder","Orlando Magic","Philadelphia 76ers","Phoenix Suns","Portland Trail Blazers",
    "Sacramento Kings","San Antonio Spurs","Toronto Raptors","Utah Jazz","Washington Wizards"
]

router.get("/:sport/feed/:type/:team", function(req, res){
    if (["NFL", "NHL", "NBA", "MLB"].indexOf(req.params.sport.toUpperCase()) >= 0){
        if (containsIn(req.params.sport, req.params.team)){
            var teamNames = req.params.team.split(" ");
            var teamName = "";
            teamNames.forEach(name => teamName = teamName + "+" + name + " ");
            newsapi.v2.everything({
                q: teamName,
                sources: 'espn',
                domains: 'espn.com',
                sortBy: 'relevance',
            }).then(espnResults => {
                newsapi.v2.everything({
                    q: teamName,
                    sources: 'bleacher-report',
                    domains: 'bleacherreport.com',
                    sortBy: 'relevance',
                }).then(brResults => {
                    res.render("feed/feed", {sport:req.params.sport, team:req.params.team, espnArticles:espnResults.articles, brArticles:brResults.articles});
                });
            });
        }else{
            res.redirect("/error");
        }
    }else{
        res.redirect("/error");
    }
});

function containsIn(sport, team){
    if (sport.toUpperCase() == "NBA"){
        if(nba.indexOf(team) >= 0){
            return true;
        }else{
            return false;
        }
    }
}

module.exports = router;
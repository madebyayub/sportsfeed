/*
    Variable declarations
*/
var express = require("express"),
  router = express.Router(),
  request = require("request"),
  middleWare = require("../middleware"),
  teams = require("../public/js/data/teams.js");

/*
    List of Youtube API keys in order to not surpass query limit.
*/
var youtubeAPIKeys = [
  "AIzaSyBMti91-v5LJmH4_l4LWQTavnp8Td2WS88",
  "AIzaSyCNnBq_3ON2s50n0b5Wf8ugoeD_323HWx8",
  "AIzaSyDT-IMGloNj3UlC0xbHNOBIVC-dXgqMsEo",
  "AIzaSyA9QslVZOo5CdDF3Gs7XXrkUHAnyL5jMpk",
];
/*
    List of Newsapi API keys in order to not surpass query limit.
*/
var newsapiAPIKeys = [
  "a02d4676a3394acebe3f2ca3a4d073e3",
  "731d3f91177b40669b537a67cb5ee591",
  "c41fdb3c651a4d638e1ea6def5d0535d",
];

/*
    Any channels that will be used to gather videos, their channel IDs are stored here.
*/
var channelIDs = {
  espn: "UCiWLfSweyRNmLpgEHekhoAg",
  nba: "UCWJ2lWNubArHWmf3FIHbfcQ",
  undisputed: "UCLXzq85ijg2LwJWFrz4pkmw",
  br: "UC9-OpMMVoNP5o10_Iyq7Ndw",
  nfl: "UCDVYQ4Zhbm3S2dlz7P1GBDg",
  nhl: "UCqFMzb-4AUf6WAIbl132QKA",
  sportsnet: "UCVhibwHk4WKw4leUt6JfRLg",
  tsn: "UC--i2rV5NCxiEIPefr3l-zQ",
};
/*
    Any possible source information goes here, to pass to the view to display
*/
var espn_info = {
    name: "ESPN",
    logo:
      "https://a.espncdn.com/wireless/mw5/r1/images/bookmark-icons-v2/espn-icon-180x180.png",
  },
  bleacher_report_info = {
    name: "Bleacher Report",
    logo: "https://bleacherreport.com/img/favicon/appleTouchIcon.png",
  },
  fox_info = {
    name: "Fox Sports",
    logo: "https://b.fssta.com/sta/images/152x152.png",
  },
  undisputed_info = {
    name: "Undisputed",
    logo:
      "https://b.fssta.com/sta/images/navSection/images/shows/nav_shows_undisputed.vadapt.160.high.0.png",
  },
  nba_info = {
    name: "NBA.com",
    logo: "https://www.nba.com/assets/icons/apple-touch-icon.png",
  },
  nfl_info = {
    name: "NFL.com",
    logo: "https://static.www.nfl.com/league/run3dfyjniqxah4ehxfu",
  },
  nhl_info = {
    name: "NHL.com",
    logo:
      "https://www-league.nhlstatic.com/nhl.com/builds/site-core/d7b71b1f9618bc99b318310b894f5e60a533547c_1588189185/images/iOS/apple-icon-144x144.png",
  },
  sportsnet_info = {
    name: "Sportsnet",
    logo:
      "https://pbs.twimg.com/profile_images/1137090735390494721/wLhyIvPY_400x400.png",
  },
  cbc_info = {
    name: "CBC",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/CBC_Logo_1992-Present.svg/1024px-CBC_Logo_1992-Present.svg.png",
  },
  tsn_info = {
    name: "TSN",
    logo: "https://www.tsn.ca/img/tsn/icons/apple-touch-icon-180x180.png",
  };

/*
    GET ROUTE
    -----------------------------
    This route displays relevant articles and videos about a team from sources chosen for the given
    sport. Before rendering the view, it gathers all videos/articles from the APIs, and
    places them into a single list, also passing that sources logo and name for display purposes.
*/
router.get("/:sport/feed/:type/:team", async function (req, res) {
  /*
        Ensure the sport param is valid, if not, send to error page.
    */
  if (["nfl", "nhl", "nba"].indexOf(req.params.sport.toLowerCase()) >= 0) {
    /*
            If the sport is valid, check if the team param is a valid team under that sport,
            if not, send to error page.
        */
    if (containsIn(req.params.sport, req.params.team)) {
      // Retrieve the team name and add the + character to ensure these words appear in the results
      var sport = req.params.sport.toLowerCase();
      var teamNames = req.params.team.split(" ");
      var teamName = "";
      teamNames.forEach((name) => (teamName = teamName + "+" + name + " "));

      // Declaration of the array that will be sent back to the client.
      var results = [];

      /*
                If the sport is NBA or NFL:
                Articles retrieved from - ESPN, Bleacher Report, Fox Sports
                Videos retrieved from - ESPN, Bleacher Report, Undisputed (FOX), NBA/NFL channels
            */
      if (sport === "nba" || sport === "nfl") {
        /*
                    Check if the type param is article
                */
        if (req.params.type.toLowerCase() === "a") {
          // Request ESPN Articles from NEWSAPI
          var espn = await getArticles(
            "espn",
            "espn.com",
            teamName,
            newsapiAPIKeys[0]
          );
          var espn_result = {
            name: espn_info.name,
            logo: espn_info.logo,
            content: espn.articles,
          };
          results.push(espn_result);
          // Request Bleacher Report Articles from NEWSAPI
          var br = await getArticles(
            "bleacher-report",
            "bleacherreport.com",
            teamName,
            newsapiAPIKeys[1]
          );
          var br_result = {
            name: bleacher_report_info.name,
            logo: bleacher_report_info.logo,
            content: br.articles,
          };
          results.push(br_result);
          // Request Fox Articles from NEWSAPI
          var fox = await getArticles(
            "fox-sports",
            "foxsports.com",
            teamName,
            newsapiAPIKeys[2]
          );
          var fox_result = {
            name: fox_info.name,
            logo: fox_info.logo,
            content: fox.articles,
          };
          results.push(fox_result);
          // Render the general article view, given the sport, team, and list of results params.
          res.render("feed/general/article", {
            sport: req.params.sport,
            team: req.params.team,
            results: results,
          });
          /*
                    Check if the type param is video
                */
        } else if (req.params.type.toLowerCase() === "v") {
          // Request Bleacher Report videos from Youtube
          var br = await getVideos(
            teamName,
            channelIDs.br,
            "bleacherreport",
            youtubeAPIKeys[3]
          );
          var br_result = {
            name: bleacher_report_info.name,
            logo: bleacher_report_info.logo,
            content: br.items,
          };
          results.push(br_result);
          // Request ESPN videos from Youtube
          var espn = await getVideos(
            teamName,
            channelIDs.espn,
            "espn",
            youtubeAPIKeys[0]
          );
          var espn_result = {
            name: espn_info.name,
            logo: espn_info.logo,
            content: espn.items,
          };
          results.push(espn_result);
          // Request Undisputed videos from Youtube
          var undisputed = await getVideos(
            teamName,
            channelIDs.undisputed,
            "undisputed",
            youtubeAPIKeys[1]
          );
          var undisputed_result = {
            name: undisputed_info.name,
            logo: undisputed_info.logo,
            content: undisputed.items,
          };
          results.push(undisputed_result);
          /*
                        If sport is NBA, get videos from the NBA Youtube channel
                        If sport is NFL, get videos from the NFL Youtube channel
                    */
          if (sport === "nba") {
            // Request NBA.com videos from Youtube
            var nba = await getVideos(
              teamName,
              channelIDs.nba,
              "nba.com",
              youtubeAPIKeys[3]
            );
            var nba_result = {
              name: nba_info.name,
              logo: nba_info.logo,
              content: nba.items,
            };
            results.push(nba_result);
          } else {
            // Request NFL.com videos from Youtube
            var nfl = await getVideos(
              teamName,
              channelIDs.nfl,
              "nfl.com",
              youtubeAPIKeys[3]
            );
            var nfl_result = {
              name: nfl_info.name,
              logo: nfl_info.logo,
              content: nfl.items,
            };
            results.push(nfl_result);
          }
          // Render the general video view, passing the sport, team and list of results params.
          res.render("feed/general/video", {
            sport: req.params.sport,
            team: req.params.team,
            results: results,
          });
          /*
                    Otherwise, redirect to the error page.
                */
        } else {
          res.redirect("/error");
        }
        /*
                If the sport is NHL:
                Articles retrieved from - CBC, Bleacher Report, NHL.com
                Videos retrieved from - TSN, Sportsnet, NHL.com
            */
      } else if (sport === "nhl") {
        /*
                    Check if the type param is article
                */
        if (req.params.type.toLowerCase() === "a") {
          // Request CBC Articles from NEWSAPI
          var cbc = await getArticles(
            "cbc-news",
            "cbc.ca",
            teamName,
            newsapiAPIKeys[0]
          );
          var cbc_result = {
            name: cbc_info.name,
            logo: cbc_info.logo,
            content: cbc.articles,
          };
          results.push(cbc_result);
          // Request Bleacher Report Articles from NEWSAPI
          var br = await getArticles(
            "bleacher-report",
            "bleacherreport.com",
            teamName,
            newsapiAPIKeys[1]
          );
          var br_result = {
            name: bleacher_report_info.name,
            logo: bleacher_report_info.logo,
            content: br.articles,
          };
          results.push(br_result);
          // Request Fox Articles from NEWSAPI
          var nhl = await getArticles(
            "nhl-news",
            "nhl.com",
            teamName,
            newsapiAPIKeys[2]
          );
          var nhl_result = {
            name: nhl_info.name,
            logo: nhl_info.logo,
            content: nhl.articles,
          };
          results.push(nhl_result);
          // Render the general article view, given the sport, team, and list of results params.
          res.render("feed/general/article", {
            sport: req.params.sport,
            team: req.params.team,
            results: results,
          });
        } else if (req.params.type.toLowerCase() === "v") {
          // Request Bleacher Report videos from Youtube
          var tsn = await getVideos(
            teamName,
            channelIDs.tsn,
            "tsn",
            youtubeAPIKeys[3]
          );
          var tsn_result = {
            name: tsn_info.name,
            logo: tsn_info.logo,
            content: tsn.items,
          };
          results.push(tsn_result);
          // Request ESPN videos from Youtube
          var sportsnet = await getVideos(
            teamName,
            channelIDs.sportsnet,
            "sportsnet",
            youtubeAPIKeys[0]
          );
          var sportsnet_result = {
            name: sportsnet_info.name,
            logo: sportsnet_info.logo,
            content: sportsnet.items,
          };
          results.push(sportsnet_result);
          // Request Undisputed videos from Youtube
          var nhl = await getVideos(
            teamName,
            channelIDs.nhl,
            "nhl.com",
            youtubeAPIKeys[1]
          );
          var nhl_result = {
            name: nhl_info.name,
            logo: nhl_info.logo,
            content: nhl.items,
          };
          results.push(nhl_result);
          // Render the general video view, passing the sport, team and list of results params.
          res.render("feed/general/video", {
            sport: req.params.sport,
            team: req.params.team,
            results: results,
          });
        }
      } else {
      }
    } else {
      res.redirect("/error");
    }
  } else {
    res.redirect("/error");
  }
});

/*
    GET ROUTE
    -----------------------------
    This route is only allowed to be accessed via an authenticated user.
    Otherwise, the user is sent to the login page to enter their credentials.
    This route displays relevant videos/articles regarding the teams the user has followed.
    Before rendering the view, it gathers all videos/articles from the APIs, and
    places them into a single list, also passing the sport and team name with the API call's results.
*/
router.get("/user/:type/feed", middleWare.isLoggedIn, async function (
  req,
  res
) {
  /*
        If the user is on the articles tab
    */
  if (req.params.type.toLowerCase() === "a") {
    // Variable declarations
    var follow_feed = [];
    var results;
    /*
            For every team/sport user is following, gather all relevant articles about that team/sport
            from every attributed source to that sport.
        */
    for (var i = 0; i < req.user.followed.length; i++) {
      var article = {
        label:
          req.user.followed[i].sport + " / " + req.user.followed[i].teamname,
        articles: [],
      };
      /*
                If the sport is NBA or NFL
                Articles sources - ESPN, Bleacher Report
            */
      if (
        req.user.followed[i].sport.toLowerCase() === "nba" ||
        req.user.followed[i].sport.toLowerCase() === "nfl"
      ) {
        results = await getArticles(
          "espn, bleacher-report",
          "espn.com, bleacherreport.com",
          req.user.followed[i].teamname,
          newsapiAPIKeys[2]
        );
        article.articles = results.articles;
        follow_feed.push(article);
        /*
                If the sport is NHL
                Articles sources - CBC, Bleacher Report
            */
      } else if (req.user.followed[i].sport.toLowerCase() === "nhl") {
        results = await getArticles(
          "cbc-news, bleacher-report",
          "cbc.ca, bleacherreport.com",
          req.user.followed[i].teamname,
          newsapiAPIKeys[0]
        );
        article.articles = results.articles;
        follow_feed.push(article);
      }
    }
    // Render the user's personal article feed, passing the results of the newsapi call as a param
    res.render("feed/user/article", { sport: "feed", result: follow_feed });
    /*
        If the user is on the videos tab
    */
  } else if (req.params.type.toLowerCase() === "v") {
    // Variable declaration
    var follow_feed = [];
    var results;
    /*
            For every team/sport user is following, gather all relevant videos about that team/sport
            from Youtube top search results.
        */
    for (var i = 0; i < req.user.followed.length; i++) {
      var video = {
        label:
          req.user.followed[i].sport + " / " + req.user.followed[i].teamname,
        videos: [],
      };
      /*
                Try to send a request to Youtube's API, if there's a fail, try the next API Key
                If all API keys do not work, redirect to the error page.
            */
      try {
        results = await getAllVideos(
          req.user.followed[i].teamname,
          youtubeAPIKeys[0]
        );
      } catch {
        try {
          results = await getAllVideos(
            req.user.followed[i].teamname,
            youtubeAPIKeys[1]
          );
        } catch {
          try {
            results = await getAllVideos(
              req.user.followed[i].teamname,
              youtubeAPIKeys[3]
            );
          } catch {
            return res.redirect("/error");
          }
        }
      }
      video.videos = results.items;
      follow_feed.push(video);
    }
    // Render the user's personal video feed, passing the results of the Youtube call as a param
    res.render("feed/user/video", { sport: "feed", result: follow_feed });
    /*
        If the type param is not set to article or video, redirect to the error page.
    */
  } else {
    res.redirect("/error");
  }
});

function getVideos(teamName, channelID, channel, APIkey) {
  return new Promise((resolve, reject) => {
    request(
      "https://www.googleapis.com/youtube/v3/search?" +
        "part=snippet&type=video&key=" +
        APIkey +
        "&channelId=" +
        channelID +
        "&maxResults=50&order=relevance&q=" +
        channel +
        " " +
        teamName,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          parsedBody = JSON.parse(body);
          return resolve(parsedBody);
        } else {
          return reject(null);
        }
      }
    );
  });
}

function getAllVideos(teamName, APIkey) {
  return new Promise((resolve, reject) => {
    request(
      "https://www.googleapis.com/youtube/v3/search?" +
        "part=snippet&type=video&key=" +
        APIkey +
        "&maxResults=50&order=relevance&q=" +
        teamName,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          parsedBody = JSON.parse(body);
          return resolve(parsedBody);
        } else {
          return reject(null);
        }
      }
    );
  });
}

function getArticles(source, domain, teamName, apikey) {
  return new Promise((resolve, reject) => {
    request(
      "https://newsapi.org/v2/everything?q=" +
        teamName +
        "&sources=" +
        source +
        "&domains=" +
        domain +
        "&apiKey=" +
        apikey,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          parsedBody = JSON.parse(body);
          return resolve(parsedBody);
        } else {
          return reject(null);
        }
      }
    );
  });
}

function containsIn(sport, team) {
  if (sport.toLowerCase() == "nba") {
    if (teams.nba.indexOf(team.toLowerCase()) >= 0) {
      return true;
    } else {
      return false;
    }
  } else if (sport.toLowerCase() == "nfl") {
    if (teams.nfl.indexOf(team.toLowerCase()) >= 0) {
      return true;
    } else {
      return false;
    }
  } else if (sport.toLowerCase() == "nhl") {
    if (teams.nhl.indexOf(team.toLowerCase()) >= 0) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = router;

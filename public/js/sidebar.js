var sidebar = document.getElementById("sidebar");
var contentsection = document.getElementById("contentSection");
var toggleBtn = document.querySelector(".sidebar-toggler");

toggleBtn.addEventListener("click", function(){
    sidebar.classList.toggle("sidebar-toggled");
});

var leagueNavs = document.querySelectorAll("#sidebar .nav-link");
leagueNavs.forEach(function(leagueNav){
    leagueNav.addEventListener("click", function(){
        var league = this.querySelector(".league-name").textContent;
        var dropbox = "." + league.toLowerCase() + "-team-list";
        document.querySelector(dropbox).classList.toggle("current");
    });
});
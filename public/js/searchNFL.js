const search = document.getElementById('search');
const matchList = document.getElementById('match-list');
const searchRow = document.querySelector('#search-row')

const searchStates = async searchText => {
    const res = await fetch("/js/data/nfl.json");
    const data = await res.json();

    let teams = data.filter(team => {
        const regex = new RegExp(`^${searchText}`, "gi");
        return team.city.match(regex) || team.name.match(regex)
    });

    if (searchText.length === 0){
        teams = [];
        matchList.innerHTML = '';
        searchRow.style.borderTopLeftRadius = '50rem';
        searchRow.style.borderTopRightRadius = '50rem';
        searchRow.style.borderBottomLeftRadius = '50rem';
        searchRow.style.borderBottomRightRadius = '50rem';
    }else{
        searchRow.style.setProperty("border-top-left-radius", "10px", "important");
        searchRow.style.setProperty("border-top-right-radius", "10px", "important");
        searchRow.style.setProperty("border-bottom-left-radius", "0", "important");
        searchRow.style.setProperty("border-bottom-right-radius", "0", "important");
    }

    outputHtml(teams);
}
const outputHtml = teams => {
    if(teams.length > 0){
        const html = teams.map(team => `
            <a href="/nfl/feed/v/${team.city} ${team.name}">
            <div class="searchResult pl-4 py-2">
                <p>${team.city} ${team.name}</p>
            </div></a>
        `).join('');
        matchList.innerHTML = html;
    }
}
search.addEventListener("input", () => searchStates(search.value));
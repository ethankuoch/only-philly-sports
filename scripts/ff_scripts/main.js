/*
    Ethan Kuoch
    OPS
*/


document.querySelector('#options-button').addEventListener('click', function() {    
    window.open(browser.runtime.getURL('../src/settings.html'));
});


function main() {
    let teamAbbrev = {};
    browser.storage.sync.get(['nfl_abbrev', 'nba_abbrev', 'mlb_abbrev', 'nhl_abbrev'])
    .then(results => {
        for (let abb in results) {
            teamAbbrev[abb.split("_")[0]] = results[abb];
        }
    })

    browser.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl'])
    .then(results => {
        for (let league in results) {
            if (results[league]) {
                parse(league, teamAbbrev[league]);
            }
        }

        setTimeout(function() {
            if (document.getElementById("cards").children.length === 0) {
                let card = new Card("alert");
                document.getElementById("cards").appendChild(card.div);
            }
        }, 500);
    })
}

main()

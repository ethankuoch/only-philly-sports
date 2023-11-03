document.querySelector('#options-button').addEventListener('click', function() {    
    window.open(browser.runtime.getURL('../src/settings.html'));
});


/**
 * Creates cards for each selected league if data was found
 */
function main() {
    const selectedLeagues = filterSelectedLeagues();
    browser.storage.sync.get(['nfl_abbrev', 'nba_abbrev', 'mlb_abbrev', 'nhl_abbrev'])
    .then((results) => {
        selectedLeagues.forEach((league) => {
            parse(league, results[`${league}_abbrev`]).then(blob => {
                if (blob['GameStatus']) {
                    const card = new Card(blob);
                    document.getElementById("cards").appendChild(card.div);
                }
            });
        });
    });
}


/**
 * Gets league browser attributes and filters from selected leagues
 * @returns a list of selected leagues
 */
function filterSelectedLeagues() {
    let selectedLeagues = [];
    browser.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl'])
    .then((results) => {
        for (const league in results) {
            if (results[league]) {
                selectedLeagues.push(league);
            }
        }
    });
    return selectedLeagues;
}


main()

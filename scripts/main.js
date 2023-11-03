document.querySelector('#options-button').addEventListener('click', function() {
    window.open(chrome.runtime.getURL('../src/settings.html'));
});


function main() {
    const selectedLeagues = filterSelectedLeagues();
    chrome.storage.sync.get(['nfl_abbrev', 'nba_abbrev', 'mlb_abbrev', 'nhl_abbrev'], function(results) {
        selectedLeagues.forEach((league) => {
            parse(league, results[`${league}_abbrev`]).then(blob => {
                if (blob['GameStatus']) {
                    // If you want a specific order, put the cards in dictionaries,
                    // get the ordered array, then loop through that array and append
                    // in that order
                    const card = new Card(blob);
                    document.getElementById("cards").appendChild(card.div);
                }
            });
        });
    });

    // Else make an alert card maybe
}


function filterSelectedLeagues() {
    let selectedLeagues = [];
    chrome.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl'], function(results) {
        for (const league in results) {
            if (results[league]) {
                selectedLeagues.push(league);
            }
        }
    });
    return selectedLeagues;
}


main();

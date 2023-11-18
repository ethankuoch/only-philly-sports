document.querySelector('#options-button').addEventListener('click', function() {
    window.open(chrome.runtime.getURL('../src/settings.html'));
});


/**
 * Converts a 24-hour time into 12-hour format
 * @param {String} time 
 * @returns HH:MM AM/PM
 */
function timeTo12(time) {
    let hours = time.slice(0, 2);
    const mins = time.slice(3, 5);
    let abb;
    if (Number(hours) >= 12) {
        abb = "PM";
    } else {
        abb = "AM";
    }
    hours = ((Number(hours) + 11) % 12) + 1;
    return `${hours}:${mins} ${abb}`;
};


function main() {
    const selectedLeagues = filterSelectedLeagues();
    chrome.storage.sync.get(['nfl_abbrev', 'nba_abbrev', 'mlb_abbrev', 'nhl_abbrev'], function(results) {
        selectedLeagues.forEach((league) => {
            parse(league, results[`${league}_abbrev`]).then((blob) => {
                if (blob['GameStatus']) {
                    chrome.storage.sync.get("military_format", function(res) {
                        const time = timeTo12(blob['GameStatus']);
                        if ((!isNaN(time) || time.includes("AM") || time.includes("PM")) && !res['military_format']) {
                            blob['GameStatus'] = time;
                        }
                        // If you want a specific order, put the cards in dictionaries,
                        // get the ordered array, then loop through that array and append
                        // in that order
                        const card = new Card(blob);
                        document.getElementById("cards").appendChild(card.div);
                    });
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

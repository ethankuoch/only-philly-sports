/*
    Ethan Kuoch
    OPS
*/

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl', 'military_format', 'nfl_abbrev', 'nba_abbrev', 'mlb_abbrev', 'nhl_abbrev'], function(results) {
        let resultsUndefined = false

        for (let key in results) {
            if (results[key]) {
                resultsUndefined = true
                break
            }
        }

        if (resultsUndefined) {
            chrome.storage.sync.set({
                'nfl': true,
                'nba': true,
                'mlb': true,
                'nhl': true,
                'military_format': false,
                'nfl_abbrev': "PHI",
                'nba_abbrev': "PHI",
                'mlb_abbrev': "PHI",
                'nhl_abbrev': "PHI",
            });
            console.log("Defaults values set.")

        } else {
            console.log("Existing data values set: ", results)
            chrome.storage.sync.set(results)
        }
    })
});

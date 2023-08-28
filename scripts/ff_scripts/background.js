/*
    Ethan Kuoch
    OPS
*/

function handleSync() {
    function checkResults(results) {
        let resultsUndefined = false
        
        for (let key in results) {
            if (results[key]) {
                resultsUndefined = true
                break
            }
        }
        
        if (resultsUndefined) {
            browser.storage.sync.set({
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
            browser.storage.sync.set(results)
        }
    }

    function onError(error) {
        console.log(error)
    }
    
    browser.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl', 'military_format', 'nfl_abbrev', 'nba_abbrev', 'mlb_abbrev', 'nhl_abbrev'])
    .then(checkResults, onError)
}

browser.runtime.onInstalled.addListener(handleSync);

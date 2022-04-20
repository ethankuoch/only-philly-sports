/*
    Ethan Kuoch
    OPS
*/

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl', 'military_format'], function(results) {
        let resultsUndefined = false
        for (let key of Object.keys(results)) {
            if (results[key] === undefined) {
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
                'military_format': false
            });
            console.log("Defaults values set.")
        } else {
            console.log("Existing data values set: ", results)
            chrome.storage.sync.set(results)
        }
    })
});

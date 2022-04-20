/*
    Ethan Kuoch
    OPS
*/

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl', 'military_format'], function(result) {
        let resultUndefined = false
        for (let key of Object.keys(result)) {
            if (result[key] === undefined) {
                resultUndefined = true
            }
        }
        if (resultUndefined) {
            chrome.storage.sync.set({
                'nfl': true,
                'nba': true,
                'mlb': true,
                'nhl': true,
                'military_format': false
            });
            console.log("Defaults values set.")
        } else {
            console.log("Existing data values set: ", result)
            chrome.storage.sync.set(result)
        }
    })
});

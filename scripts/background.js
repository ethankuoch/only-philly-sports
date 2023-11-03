chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl', 'military_format', 'nfl_abbrev', 'nba_abbrev', 'mlb_abbrev', 'nhl_abbrev'], function(results) {
        for (const key in results) {
            if (results[key] != undefined) {
                chrome.storage.sync.set({key: results[key]})
            } else {
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
                break
            }
        }
    })
});

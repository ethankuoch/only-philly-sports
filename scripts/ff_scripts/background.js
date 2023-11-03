function handleSync() {
    /**
     * Checks for synced items 
     * @param {List} items list of key value pairs from get
     */
    function checkSyncedItems(items) {
        for (const key in items) {
            if (results[key] != undefined) {
                browser.storage.sync.set({key: results[key]})
            } else {
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
                break
            }
        }
    }

    function onError(err) {
        console.log(err)
    }
    
    browser.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl', 'military_format', 'nfl_abbrev', 'nba_abbrev', 'mlb_abbrev', 'nhl_abbrev'])
    .then(checkSyncedItems, onError)
}

browser.runtime.onInstalled.addListener(handleSync);

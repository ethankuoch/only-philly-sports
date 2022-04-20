/*
    Ethan Kuoch
    OPS
*/

function save_options() {
    let nfl = document.getElementById('nfl').checked;
    let nba = document.getElementById('nba').checked;
    let mlb = document.getElementById('mlb').checked;
    let nhl = document.getElementById('nhl').checked;
    let military_format = document.getElementById('military_format').checked;
    
    chrome.storage.sync.set({
        'nfl': nfl,
        'nba': nba,
        'mlb': mlb,
        'nhl': nhl,
        'military_format': military_format,
    }, function() {
        // Update status to let user know options were saved.
        document.getElementById('save').textContent = 'Options saved.';
        setTimeout(function() {
            document.getElementById('save').textContent = 'Save';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl', 'military format'], function(results) {
        document.getElementById('nfl').checked = results['nfl'];
        document.getElementById('nba').checked = results['nba'];
        document.getElementById('mlb').checked = results['mlb'];
        document.getElementById('nhl').checked = results['nhl'];
        document.getElementById('military_format').checked = results['military_format'];
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

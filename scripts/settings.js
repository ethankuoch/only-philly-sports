/*
    Ethan Kuoch
    OPS
*/

function save_options() {   
    chrome.storage.sync.set({
        'nfl': document.getElementById('nfl').checked,
        'nba': document.getElementById('nba').checked,
        'mlb': document.getElementById('mlb').checked,
        'nhl': document.getElementById('nhl').checked,
        'military_format': document.getElementById('military_format').checked,
    }, function() {
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

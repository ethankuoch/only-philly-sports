/*
    Ethan Kuoch
    OPS
*/

function timeTo12(time) {
    let hours = time.slice(0, 2);
    let mins = time.slice(3, 5);
    let abb;
    if (Number(hours) >= 12) {
        abb = "PM";
    } else {
        abb = "AM";
    }
    hours = ((Number(hours) + 11) % 12) + 1;

    return `${hours}:${mins} ${abb}`
};

document.querySelector('#options-button').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('settings.html'));
    }
});

function NFL(api) {
    fetch(api)
        .then((res) => res.json())
        .then((out) => {
            let games = out['events'];
            for (let game of games) {
                if (game['shortName'].includes("PHI") && String(new Date(game['date'])).slice(0, 15) === String(new Date()).slice(0, 15)) {
                    document.getElementById("nfl").style.display = "block";
                    document.getElementById("alert").style.display = "none";

                    let home_team   = game['competitions'][0]['competitors'][0]['team'];
                    let home_score  = game['competitions'][0]['competitors'][0]['score'];
                    let away_team   = game['competitions'][0]['competitors'][1]['team'];
                    let away_score  = game['competitions'][0]['competitors'][1]['score'];

                    document.getElementById("nfl-away-logo").src = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${away_team['abbreviation']}.png`;
                    document.getElementById("nfl-home-logo").src = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${home_team['abbreviation']}.png`;
                    document.getElementById("nfl-score").textContent = `${away_score} - ${home_score}`;

                    if (game['status']['type']['description'] === "In Progress" && game['status']['period'] >= 1) {
                        document.getElementById("nfl-status").style.color = "red";
                        document.getElementById("nfl-status").textContent = `Q${game['status']['period']} | ${game['status']['displayClock']}`;
                    } else if (game['status']['type']['description'] === "Scheduled") {
                        chrome.storage.sync.set({"nfl_time": (new Date(game['date'])).toString().slice(16, 21)})
                        chrome.storage.sync.get(['military_format'], (results) => {
                            chrome.storage.sync.get(['nfl_time'], (time) => {
                                if (results['military_format']) {
                                    document.getElementById("nfl-status").textContent = `${time['nfl_time']}`
                                } else {
                                    document.getElementById("nfl-status").textContent = `${timeTo12(time['nfl_time'])}`
                                }
                            })
                        })
                        document.getElementById("nfl-score").textContent = `${game['shortName']}`;
                    } else if (game['status']['type']['description'] === "Halftime") {
                        document.getElementById("nfl-status").textContent = "Half";
                    } else if (game['status']['type']['completed'] === true) {
                        document.getElementById("nfl-status").textContent = "Final";
                    }
                    break
                }
            }
        });
}

function NBA(api) {
    fetch(api)
        .then((res) => res.json())
        .then((out) => {
        let games = out['games'];
        for (let game of games) {
            if (game['hTeam']['triCode'] === "PHI" || game['vTeam']['triCode'] === "PHI" ) {
                document.getElementById("nba").style.display = "block";
                document.getElementById("alert").style.display = "none";

                let home = game['hTeam'];
                let away = game['vTeam'];

                document.getElementById("nba-away-logo").src = `https://cdn.nba.com/logos/nba/${away['teamId']}/primary/L/logo.svg`;
                document.getElementById("nba-home-logo").src = `https://cdn.nba.com/logos/nba/${home['teamId']}/primary/L/logo.svg`;
                document.getElementById("nba-score").textContent = `${away['score']} - ${home['score']}`;

                if (game['isGameActivated'] === true && game['period']['current'] >= 1) {
                    document.getElementById("nba-status").style.color = "red";
                    document.getElementById("nba-status").textContent = `Q${game['period']['current']} | ${game['clock']}`;
                    if (game['period']['isHalftime'] === true) {
                        document.getElementById("nba-status").textContent = "Half";
                    } else if (game['gameDuration']['minutes'] === "") {
                        document.getElementById("nba-status").textContent = `${time}`;
                        document.getElementById("nba-score").textContent = `${away['triCode']} @ ${home['triCode']}`;
                    }
                } else if (game['gameDuration']['minutes'] === "") {
                    chrome.storage.sync.set({['nba_time']: (new Date(game['startTimeUTC'])).toString().slice(16, 21)})
                    chrome.storage.sync.get(['military_format'], (results) => {
                        chrome.storage.sync.get(['nba_time'], (time) => {
                            if (results['military_format']) {
                                document.getElementById("nba-status").textContent = `${time['nba_time']}`
                            } else {
                                document.getElementById("nba-status").textContent = `${timeTo12(time['nba_time'])}`
                            }
                        })
                    })
                    document.getElementById("nba-score").textContent = `${away.triCode} @ ${home.triCode}`;
                } else {
                    document.getElementById("nba-status").textContent = "Final";
                }
                break
            }
        }
    });
}

function NHLMLB(api, league) {
    fetch(api)
        .then((res) => res.json())
        .then((out) => {
        for (let date of out['dates']) {
            for (let game of date['games']) {
                let game_number = out['dates'][0]['games'].indexOf(game)
                document.getElementById(`${league}${game_number}`).style.display = "block";
                document.getElementById("alert").style.display = "none";
    
                let away = game['teams']['away'];
                let home = game['teams']['home'];
    
                if (league === "nhl") {
                    document.getElementById("nhl-away-logo").src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${away['team']['id']}.svg`;
                    document.getElementById("nhl-home-logo").src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${home['team']['id']}.svg`;
                } else {
                    document.getElementsByClassName("mlb-away-logo")[game_number].src = `https://www.mlbstatic.com/team-logos/${away['team']['id']}.svg`;
                    document.getElementsByClassName("mlb-home-logo")[game_number].src = `https://www.mlbstatic.com/team-logos/${home['team']['id']}.svg`;
                }
    
                document.getElementById(`${league}${game_number}-score`).textContent = `${away['score']} - ${home['score']}`;
                
                if (game['status']['detailedState'] === "Postponed") {
                    document.getElementById(`${league}${game_number}-status`).textContent = "Postponed";
                    document.getElementById(`${league}${game_number}-score`).textContent = `${away['team']['abbreviation']} @ ${home['team']['abbreviation']}`;
                } else if (game['status']['detailedState'] === "Delayed: Rain") {
                    document.getElementById(`${league}${game_number}-status`).textContent = "Rain Delay";
                } else if (game['status']['detailedState'] === "In Progress" || game['status']['detailedState'] === "In Progress - Critical") {
                    linescore = game.linescore;
                    document.getElementById(`${league}${game_number}-status`).style.color = "red";
                    if (league === "nhl") {
                        document.getElementById(`${league}${game_number}-status`).textContent = `P${linescore['currentPeriod']} | ${linescore['currentPeriodTimeRemaining']}`;
                    } else {
                        document.getElementById(`${league}${game_number}-status`).textContent = `${linescore['inningState'].slice(0, 4)} ${linescore['currentInningOrdinal']}`;
                    }
                } else if (game['status']['abstractGameState'] === "Final") {
                    document.getElementById(`${league}${game_number}-status`).textContent = "Final";
                } else {
                    if (league === "nhl") {
                        chrome.storage.sync.set({"nhl_time": (new Date(game.gameDate)).toString().slice(16, 21)})
                        chrome.storage.sync.get("military_format", (results) => {
                            chrome.storage.sync.get("nhl_time", (time) => {
                                if (results['military_format']) {
                                    document.getElementById(`nhl${game_number}-status`).textContent = `${time['nhl_time']}`
                                } else {
                                    document.getElementById(`nhl${game_number}-status`).textContent = `${timeTo12(time['nhl_time'])}`
                                }
                            })
                        })
                    } else {
                        chrome.storage.sync.set({"mlb_time": (new Date(game['gameDate'])).toString().slice(16, 21)})
                        chrome.storage.sync.get("military_format", (results) => {
                            chrome.storage.sync.get("mlb_time", (time) => {
                                if (results['military_format']) {
                                    document.getElementById(`mlb${game_number}-status`).textContent = `${time['mlb_time']}`
                                } else {
                                    document.getElementById(`mlb${game_number}-status`).textContent = `${timeTo12(time['mlb_time'])}`
                                }
                            })
                        })
                    }
                    document.getElementById(`${league}${game_number}-score`).textContent = `${away['team']['abbreviation']} @ ${home['team']['abbreviation']}`;
                }
            }
        }
    });
}

chrome.storage.sync.get(['nfl', 'nba', 'mlb', 'nhl'], function(results) {
    let today   = new Date();
    let day     = String(today.getDate()).padStart(2, "0");
    let month   = String(today.getMonth() + 1).padStart(2, "0");
    let year    = today.getFullYear();

    today           = year + "-" + month + "-" + day;
    let nbaToday    = year + month + day;

    if (results['nfl']) {
        NFL(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`);
    } if (results['nba']) {
        NBA(`http://data.nba.net/prod/v2/${nbaToday}/scoreboard.json`);
    } if (results['mlb']) {
        NHLMLB(`https://statsapi.mlb.com/api/v1/schedule?&sportId=1&teamId=143&date=${today}&sortBy=gameDate&hydrate=team,linescore`, "mlb");
    } if (results['nhl']) {
        NHLMLB(`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${today}&endDate=${today}&hydrate=team,linescore&teamId=4`, "nhl");
    }
})

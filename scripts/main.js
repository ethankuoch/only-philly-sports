// Ethan Kuoch

let today   = new Date();
let dd      = String(today.getDate()).padStart(2, "0");
let mm      = String(today.getMonth() + 1).padStart(2, "0");
let yyyy    = today.getFullYear();
today       = yyyy + "-" + mm + "-" + dd;
nbaToday    = yyyy + mm + dd;

function timeTo12(time) {
    let hours = time.slice(0, 2);
    let mins = time.slice(3, 5);
    let abb
    if (Number(hours) >= 12) {
        abb = "PM";
    } else {
        abb = "AM";
    }
    hours = ((Number(hours) + 11) % 12) + 1;
    return `${hours}:${mins} ${abb}`;
}

document.querySelector('#options-button').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('settings.html'));
    }
});

function NFL(nfl) {
    fetch(nfl)
        .then((res) => res.json())
        .then((out) => {
            let games = out.events;
            for (let game of games) {
                if (game.shortName.includes("PHI") && String(new Date(game.date)).slice(0, 15) === String(new Date()).slice(0, 15)) {
                    document.getElementById("nfl").style.display = "block";
                    document.getElementById("alert").style.display = "none";
                    let home = game.competitions[0].competitors[0].team;
                    let homeScore = game.competitions[0].competitors[0].score;
                    let away = game.competitions[0].competitors[1].team;
                    let awayScore = game.competitions[0].competitors[1].score;
                    document.getElementById("nfl-away-logo").src = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${away.abbreviation}.png`;
                    document.getElementById("nfl-home-logo").src = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${home.abbreviation}.png`;
                    document.getElementById("nfl-score").textContent = `${awayScore} - ${homeScore}`;

                    if (game.status.type.description === "In Progress" && game.status.period >= 1) {
                        document.getElementById("nfl-status").style.color = "red";
                        document.getElementById("nfl-status").textContent = `Q${game.status.period} | ${game.status.displayClock}`;
                    } else if (game.status.type.description === "Scheduled") {
                        chrome.storage.sync.set({"nfl_time": (new Date(game.date)).toString().slice(16, 21)})
                        chrome.storage.sync.get("military_format", (data) => {
                            chrome.storage.sync.get("nfl_time", (time) => {
                                if (data.military_format === false) {
                                    document.getElementById("nfl-status").textContent = `${timeTo12(time.nfl_time)}`
                                } else {
                                    document.getElementById("nfl-status").textContent = `${time.nfl_time}`
                                }
                            })
                        })
                        document.getElementById("nfl-score").textContent = `${game.shortName}`;
                    } else if (game.status.type.description === "Halftime") {
                        document.getElementById("nfl-status").textContent = "Half";
                    } else if (game.status.type.completed === true) {
                        document.getElementById("nfl-status").textContent = "Final";
                    }
                }
            }
        });
}

function NBA(nba) {
    fetch(nba)
        .then((res) => res.json())
        .then((out) => {
        let games = out.games;
        for (let game of games) {
            if (game.hTeam.triCode === "PHI" || game.vTeam.triCode === "PHI" ) {
                document.getElementById("nba").style.display = "block";
                document.getElementById("alert").style.display = "none";
                let home = game.hTeam;
                let away = game.vTeam;
                document.getElementById("nba-away-logo").src = `https://cdn.nba.com/logos/nba/${away.teamId}/primary/L/logo.svg`;
                document.getElementById("nba-home-logo").src = `https://cdn.nba.com/logos/nba/${home.teamId}/primary/L/logo.svg`;
                document.getElementById("nba-score").textContent = `${away.score} - ${home.score}`;
                if (game.isGameActivated === true && game.period.current >= 1) {
                    document.getElementById("nba-status").style.color = "red";
                    document.getElementById("nba-status").textContent = `Q${game.period.current} | ${game.clock}`;
                    if (game.period.isHalftime === true) {
                        document.getElementById("nba-status").textContent = "Half";
                    } else if (game.gameDuration.minutes === "") {
                        document.getElementById("nba-status").textContent = `${time}`;
                        document.getElementById("nba-score").textContent = `${away.triCode} @ ${home.triCode}`;
                    }
                } else if (game.gameDuration.minutes === "") {
                    chrome.storage.sync.set({"nba_time": (new Date(game.startTimeUTC)).toString().slice(16, 21)})
                    chrome.storage.sync.get("military_format", (data) => {
                        chrome.storage.sync.get("nba_time", (time) => {
                            if (data.military_format === false) {
                                document.getElementById("nba-status").textContent = `${timeTo12(time.nba_time)}`
                            } else {
                                document.getElementById("nba-status").textContent = `${time.nba_time}`
                            }
                        })
                    })
                    document.getElementById("nba-score").textContent = `${away.triCode} @ ${home.triCode}`;
                } else {
                    document.getElementById("nba-status").textContent = "Final";
                }
            }
        }
    });
}

function NHLMLB(api, league) {
    fetch(api)
        .then((res) => res.json())
        .then((out) => {
        let games = out['dates'][0]['games']
        for (let game of games) {
            document.getElementById(`${league}${games.indexOf(game)}`).style.display = "block";
            document.getElementById("alert").style.display = "none";
            let away = game.teams.away;
            let home = game.teams.home;
            if (league === "nhl") {
                document.getElementById("nhl-away-logo").src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${away.team.id}.svg`;
                document.getElementById("nhl-home-logo").src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${home.team.id}.svg`;
            } else {
                document.getElementsByClassName("mlb-away-logo")[games.indexOf(game)].src = `https://www.mlbstatic.com/team-logos/${away.team.id}.svg`;
                document.getElementsByClassName("mlb-home-logo")[games.indexOf(game)].src = `https://www.mlbstatic.com/team-logos/${home.team.id}.svg`;
            }
            document.getElementById(`${league}${games.indexOf(game)}-score`).textContent = `${away.score} - ${home.score}`;
            if (game.status.detailedState === "Postponed") {
                document.getElementById(`${league}${games.indexOf(game)}-status`).textContent = "Postponed";
                document.getElementById(`${league}${games.indexOf(game)}-score`).textContent = `${away.team.abbreviation} @ ${home.team.abbreviation}`;
            } else if (game.status.detailedState === "Delayed: Rain") {
                document.getElementById(`${league}${games.indexOf(game)}-status`).textContent = "Rain Delay";
            } else if (game.status.detailedState === "In Progress" || game.status.detailedState === "In Progress - Critical") {
                linescore = game.linescore;
                document.getElementById(`${league}${games.indexOf(game)}-status`).style.color = "red";
                if (league === "nhl") {
                    document.getElementById(`${league}${games.indexOf(game)}-status`).textContent = `P${linescore.currentPeriod} | ${linescore.currentPeriodTimeRemaining}`;
                } else {
                    document.getElementById(`${league}${games.indexOf(game)}-status`).textContent = `${linescore.inningState.slice(0, 4)} ${linescore.currentInningOrdinal}`;
                }
            } else if (game.status.abstractGameState === "Final") {
                document.getElementById(`${league}${games.indexOf(game)}-status`).textContent = "Final";
            } else {
                if (league === "mlb") {
                    chrome.storage.sync.set({"mlb_time": (new Date(game.gameDate)).toString().slice(16, 21)})
                    chrome.storage.sync.get("military_format", (data) => {
                        chrome.storage.sync.get("mlb_time", (time) => {
                            if (data.military_format === false) {
                                document.getElementById(`mlb${games.indexOf(game)}-status`).textContent = `${timeTo12(time.mlb_time)}`
                            } else {
                                document.getElementById(`mlb${games.indexOf(game)}-status`).textContent = `${time.mlb_time}`
                            }
                        })
                    })
                } else {
                    chrome.storage.sync.set({"nhl_time": (new Date(game.gameDate)).toString().slice(16, 21)})
                    chrome.storage.sync.get("military_format", (data) => {
                        chrome.storage.sync.get("nhl_time", (time) => {
                            if (data.military_format === false) {
                                document.getElementById(`nhl${games.indexOf(game)}-status`).textContent = `${timeTo12(time.nhl_time)}`
                            } else {
                                document.getElementById(`nhl${games.indexOf(game)}-status`).textContent = `${time.nhl_time}`
                            }
                        })
                    })
                }
                document.getElementById(`${league}${games.indexOf(game)}-score`).textContent = `${away.team.abbreviation} @ ${home.team.abbreviation}`;
            }
        }
    });
}
// Call above functions
chrome.storage.sync.get("nfl", (data) => {
    if (data.nfl) {
        nfl = `http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`;
        NFL(nfl);
    }
})
chrome.storage.sync.get("nba", (data) => {
    if (data.nba) {
        nba = `http://data.nba.net/prod/v2/${nbaToday}/scoreboard.json`;
        NBA(nba);
    }
})
chrome.storage.sync.get("mlb", (data) => {
    if (data.mlb) {
        mlb = `https://statsapi.mlb.com/api/v1/schedule?&sportId=1&teamId=143&date=${today}&sortBy=gameDate&hydrate=team,linescore`;
        NHLMLB(mlb, "mlb");
    }
})
chrome.storage.sync.get("nhl", (data) => {
    if (data.nhl) {
        nhl = `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${today}&endDate=${today}&hydrate=team,linescore&teamId=4`;
        NHLMLB(nhl, "nhl");
    }
})

/**
 * Formats the time based on browser storage settings
 * @param {String} time time that the game starts
 * @returns the time in either 12-hour or 24-hour format
 */
function formatTime(time) {
    /**
     * Converts a 24-hour time into 12-hour format
     * @param {String} time 
     * @returns HH:MM AM/PM
     */
    function timeTo12(time) {
        let hours = time.slice(0, 2);
        const mins = time.slice(3, 5);
        let abb;
        if (Number(hours) >= 12) {
            abb = "PM";
        } else {
            abb = "AM";
        }
        hours = ((Number(hours) + 11) % 12) + 1;
        return `${hours}:${mins} ${abb}`;
    };

    chrome.storage.sync.get("military_format", (results) => {
        if (results['military_format']) {
            return time;
        } else {
            return timeTo12(time);
        }
    });
}


/**
 * Sets the game score and status in blob from api call
 * @param {Dictionary} blob object of specific api data
 * @param {Dictionary} game entire game details from api call
 * @param {Dictionary} away entire away details from api call
 * @param {Dictionary} home entire home details from api call
 * @param {String} league string of the league
 * @param {String} statusKey string specifying the key in blob to store status
 * @param {String} scoreKey string specifying the key in blob to store score
 * @param {String} liveKey string specifying the key in blob to store isLive bool
 */
function setGameScoreAndStatus(blob, game, away, home, league, statusKey, scoreKey, liveKey) {
    const gameStatus = game['status']['type']['description'];
    if (gameStatus.includes("In Progress") && game['status']['period'] >= 1) {
        blob[liveKey] = true;
        if (league == "mlb") {
            blob[statusKey] = `${game['status']['type']['shortDetail']}`;
        } else {
            blob[statusKey] = `Q${game['status']['period']} | ${game['status']['displayClock']}`;
        }
        blob[scoreKey] = `${away['score']} - ${home['score']}`;
    } else if (gameStatus.includes("Pre-Game") || gameStatus.includes("Scheduled")) {
        blob[statusKey] = formatTime((new Date(game['date'])).toString().slice(16, 21));
        blob[scoreKey] = `${game['shortName']}`;
    } else {
        blob[statusKey] = gameStatus;
        if (away['score'] || home['score']) {
            blob[scoreKey] = `${away['score']} - ${home['score']}`;
        } else {
            blob[scoreKey] = `${away['team']['abbreviation']} @ ${home['team']['abbreviation']}`;
        }
    }
}


/**
 * Fetches api endpoint and creates a blob of specific data
 * @param {String} league string of theleague
 * @param {String} teamAbbrev tricode of team to look for
 * @returns a blob dictionary with specific api data
 */
async function parse(league, teamAbbrev) {
    const response = await fetch(getEndpoint(league));
    const json = await response.json();
    
    if (json['events'] == null) {
        console.log("Error getting API response.");
        return;
    }
    const games = json['events'];

    let game_number = 0;
    let blob = {
        'League': league,
        'GameStatus': '',
        'isGameLive': false,
        'GameScore': '',
        'HomeLogo': '',
        'AwayLogo': '',
        'isDoubleHeader': false
    };
    for (const game of games) {
        if (game['shortName'].includes(teamAbbrev)) {
            const away = game['competitions'][0]['competitors'][1];
            const home = game['competitions'][0]['competitors'][0];
            
            // Accounting for a doubleheader
            game_number += 1;
            if (game_number > 1) {
                blob['isDoubleHeader'] = true;
                setGameScoreAndStatus(blob, game, away, home, league, 'Game2Status', 'Game2Score', 'isGame2Live');
                break;
            }

            // Get images
            blob['AwayLogo'] = getImage(league, away['team']['abbreviation']);
            blob['HomeLogo'] = getImage(league, home['team']['abbreviation']);
            
            // Set game status and score
            setGameScoreAndStatus(blob, game, away, home, league, 'GameStatus', 'GameScore', 'isGameLive');
            if (league !== "mlb") {
                break;
            }
        }
    }
    return blob;
}

/**
 * Sets the game score and status in blob from api call
 * @param {object} blob object of specific api data
 * @param {object} game entire game details from api call
 * @param {object} away entire away details from api call
 * @param {object} home entire home details from api call
 * @param {string} league string of the league
 * @param {string} statusKey string specifying the key in blob to store status
 * @param {string} scoreKey string specifying the key in blob to store score
 * @param {string} liveKey string specifying the key in blob to store isLive bool
 */
function setGameScoreAndStatus(
  blob,
  game,
  away,
  home,
  league,
  statusKey,
  scoreKey,
  liveKey,
) {
  const gameStatus = game["status"]["type"]["description"];
  if (gameStatus.includes("In Progress") && game["status"]["period"] >= 1) {
    blob[liveKey] = true;
    if (league === "mlb") {
      blob[statusKey] = `${game["status"]["type"]["shortDetail"]}`;
    } else {
      blob[statusKey] =
        `Q${game["status"]["period"]} | ${game["status"]["displayClock"]}`;
    }
    blob[scoreKey] = `${away["score"]} - ${home["score"]}`;
  } else if (
    gameStatus.includes("Pre-Game") ||
    gameStatus.includes("Scheduled")
  ) {
    blob[statusKey] = new Date(game["date"]).toString().slice(16, 21);
    blob[scoreKey] = `${game["shortName"]}`;
  } else {
    blob[statusKey] = game["status"]["type"]["shortDetail"];
    if (away["score"] || home["score"]) {
      blob[scoreKey] = `${away["score"]} - ${home["score"]}`;
    } else {
      blob[scoreKey] =
        `${away["team"]["abbreviation"]} @ ${home["team"]["abbreviation"]}`;
    }
  }
}

/**
 * Fetches api endpoint and creates a blob of specific data
 * @param {string} league string of the league
 * @param {string} teamAbbrev tricode of team to look for
 * @returns a blob dictionary with specific api data
 */
async function parse(league, teamAbbrev) {
  const response = await fetch(getEndpoint(league));
  const json = await response.json();

  if (json["events"] == null) {
    console.log("Error getting API response.");
    return;
  }
  const games = json["events"];

  let game_number = 0;
  let blob = {
    League: league,
    GameStatus: "",
    isGameLive: false,
    GameScore: "",
    HomeLogo: "",
    AwayLogo: "",
    isDoubleHeader: false,
  };
  for (const game of games) {
    if (game["shortName"].includes(teamAbbrev)) {
      const away = game["competitions"][0]["competitors"][1];
      const home = game["competitions"][0]["competitors"][0];

      // Accounting for a doubleheader
      game_number += 1;
      if (game_number > 1) {
        blob["isDoubleHeader"] = true;
        setGameScoreAndStatus(
          blob,
          game,
          away,
          home,
          league,
          "Game2Status",
          "Game2Score",
          "isGame2Live",
        );
        break;
      }

      // Get images
      blob["AwayLogo"] = getImage(league, away["team"]["abbreviation"]);
      blob["HomeLogo"] = getImage(league, home["team"]["abbreviation"]);

      // Set game status and score
      setGameScoreAndStatus(
        blob,
        game,
        away,
        home,
        league,
        "GameStatus",
        "GameScore",
        "isGameLive",
      );
      if (league !== "mlb") {
        break;
      }
    }
  }
  return blob;
}

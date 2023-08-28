async function parse(league, teamAbbrev) {
    const response = await fetch(getEndpoint(league));
    const json = await response.json();
    
    if (json['events'] == null) {
        return
    }
    const games = json['events'];

    let game_number = -1
    for (let game of games) {
        const dateCheck = String(new Date(game['date'])).slice(0, 15) === String(new Date()).slice(0, 15)

        if (game['shortName'].includes(teamAbbrev) && dateCheck) {
            const card = new Card(league);
            document.getElementById("cards").appendChild(card.div);
            
            game_number += 1
            document.getElementById(`${league}${game_number+1}`).style.display = "block";

            const home = game['competitions'][0]['competitors'][0];
            const away = game['competitions'][0]['competitors'][1];

            // Get images
            setImage(`${league}-home-logo`, game_number, home['team']['abbreviation'], league)
            setImage(`${league}-away-logo`, game_number, away['team']['abbreviation'], league)

            let game_state = game['status']['type']['description'];
            let game_status = document.getElementsByClassName(`${league}-status`)[game_number];
            let game_score = document.getElementsByClassName(`${league}-score`)[game_number];
            
            // evaluate game status
            if (game_state.includes("In Progress") && game['status']['period'] >= 1) {
                game_status.style.color = "red";
                setTextContent(game_status, `Q${game['status']['period']} | ${game['status']['displayClock']}`);
                setTextContent(game_score, `${away['score']} - ${home['score']}`);
                
            } else if (game_state.includes("Pre-Game") || game_state.includes("Scheduled")) {
                format_time((new Date(game['date'])).toString().slice(16, 21), game_status);
                setTextContent(game_score, `${game['shortName']}`);
            } else {
                setTextContent(game_status, game_state)
                if (away['score'] || home['score']) {
                    setTextContent(game_score, `${away['score']} - ${home['score']}`);
                } else {
                    setTextContent(game_score, `${away['team']['abbreviation']} @ ${home['team']['abbreviation']}`);
                }
            }

            if (league !== "mlb") {
                break
            }
        }
    }
}

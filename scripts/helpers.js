function format_time(time, div) {
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
            div.textContent = time;
        } else {
            div.textContent = timeTo12(time);
        }
    });
}

function setTextContent(div, text) {
    div.textContent = text;
}

function setImage(div, index, team, league) {
    if (parseInt(team) === team) {
        document.getElementsByClassName(div)[index].src = getImage(league, team);
    } else {
        document.getElementsByClassName(div)[index].src = getImage(league, team.toLowerCase());
    }
}
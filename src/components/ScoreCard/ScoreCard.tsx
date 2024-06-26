import "./ScoreCard.css";
import { useEffect, useState } from "react";
import { GameInfo, parse } from "../../utils/api.ts";
import { timeTo12 } from "../../utils/helpers.ts";
import { Avatar } from "@mantine/core";
type ScoreCardProps = {
  league: string;
};

const ScoreCard = (props: ScoreCardProps) => {
  const [gamesData, setGamesData] = useState<GameInfo[]>([]);

  useEffect(() => {
    chrome.storage.sync.get([`${props.league}Teams`], (results) => {
      parse(props.league, results[`${props.league}Teams`]).then(
        (games: GameInfo[] | undefined) => {
          if (typeof games !== "undefined" && games.length > 0) {
            chrome.storage.sync.get(["is24HourFormat"], (res) => {
              for (const game of games) {
                const time = timeTo12(game.GameStatus);
                if (!time.includes("NaN:") && !res.is24HourFormat) {
                  game.GameStatus = time;
                }
              }
              setGamesData(games);
            });
          }
        },
      );
    });
  }, [props.league]);

  if (gamesData.length === 0) return null;
  return (
    <>
      <h3>{props.league.toUpperCase()}</h3>
      {gamesData.map((game) => (
        <div className="game">
          <p className={`status ${game.isGameLive ? "live-game" : ""}`}>
            {game.GameStatus}
          </p>{" "}
          <div className="row">
            <Avatar src={game.AwayLogo} size={65} radius="0" />
            <span>{game.GameScore}</span>
            <Avatar src={game.HomeLogo} size={65} radius="0" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ScoreCard;

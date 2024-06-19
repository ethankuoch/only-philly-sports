import { useEffect, useState } from "react";
import { MantineProvider } from "@mantine/core";
import ScoreCard from "./components/ScoreCard/ScoreCard.tsx";
import "./App.css";
import "@mantine/core/styles.css";
import { teamCodes } from "./utils/api.ts";

function App() {
  const [leagues, setLeagues] = useState<string[]>([]);

  useEffect(() => {
    chrome.storage.sync.get(Object.keys(teamCodes), (results) => {
      const enabledLeagues = Object.keys(results).filter(
        (key) => results[key] === true,
      );
      setLeagues(enabledLeagues);
    });
  }, []);

  return (
    <>
      <MantineProvider>
        {leagues.map((league) => (
          <ScoreCard league={league} />
        ))}
      </MantineProvider>
    </>
  );
}

export default App;

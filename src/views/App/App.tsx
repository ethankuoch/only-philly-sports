import { useEffect, useState } from "react";
import { MantineProvider } from "@mantine/core";
import ScoreCard from "../../components/ScoreCard/ScoreCard.tsx";
import "./App.css";
import "@mantine/core/styles.css";
import { teamCodes } from "../../utils/api.ts";

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

  function optionsPage() {
    chrome.tabs.query(
      {
        url: "chrome-extension://" + chrome.runtime.id + "/popup.html",
        currentWindow: true,
      },
      function (tabs: chrome.tabs.Tab[]) {
        if (tabs.length > 0) {
          chrome.tabs
            .highlight({
              windowId: tabs[0].windowId,
              tabs: tabs[0].index,
            })
            .then();
          chrome.tabs.reload(tabs[0].id as number).then();
        } else {
          chrome.tabs
            .create({ url: chrome.runtime.getURL("options.html") })
            .then();
        }
      },
    );
  }

  return (
    <>
      <MantineProvider>
        {leagues.map((league) => (
          <ScoreCard league={league} />
        ))}
      </MantineProvider>
      <div id="options-btn" onClick={optionsPage}>
        <span>V</span>
      </div>
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import {
  Checkbox,
  Group,
  HoverCard,
  MantineProvider,
  Switch,
  Text,
} from "@mantine/core";
import "./Options.css";
import "@mantine/core/styles.css";
import TeamSelect from "../../components/TeamSelect/TeamSelect.tsx";
import { IconInfoCircle } from "@tabler/icons-react";
import { teamCodes } from "../../utils/api.ts";

function App() {
  const [x24HourTime, set24HourTime] = useState<boolean>();
  const [leagueToggles, setLeagueToggles] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const combinedGet = Object.keys(teamCodes);
    combinedGet.push("is24HourFormat");
    chrome.storage.sync.get(combinedGet, (results) => {
      set24HourTime(results["is24HourFormat"]);
      const leagues = results;
      delete leagues["is24HourFormat"];
      setLeagueToggles(leagues);
    });
  }, []);

  function handle24TimeFormatChange(is24HourBool: boolean): void {
    set24HourTime(is24HourBool);
    chrome.storage.sync.set({ is24HourFormat: is24HourBool }).then();
  }

  function handleLeagueChange(target: EventTarget & HTMLInputElement): void {
    const newLeagueToggle = leagueToggles;
    newLeagueToggle[target.id] = target.checked;
    setLeagueToggles(newLeagueToggle);
    chrome.storage.sync.set(newLeagueToggle).then();
  }

  return (
    <>
      <MantineProvider>
        <h1>Options</h1>
        <div className="section">
          <h3>Team select</h3>
          <Group justify="center">
            <HoverCard
              width={320}
              shadow="md"
              withArrow
              openDelay={100}
              closeDelay={200}
            >
              <HoverCard.Target>
                <IconInfoCircle />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="sm" mt="sm">
                  Up to 2 teams can be selected per league
                </Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Group>
        </div>
        <div className={"team-select"}>
          {Object.keys(leagueToggles).map((league) => (
            <div className="team-select-row">
              <Checkbox
                defaultChecked={leagueToggles[league]}
                id={league}
                color={"black"}
                onChange={(event) => handleLeagueChange(event.currentTarget)}
              />
              <TeamSelect league={league} />
            </div>
          ))}
        </div>
        <h3>Other</h3>
        <Switch
          label="24 hour format"
          checked={x24HourTime}
          onChange={(event) =>
            handle24TimeFormatChange(event.currentTarget.checked)
          }
        />
      </MantineProvider>
    </>
  );
}

export default App;

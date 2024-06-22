import { getTeamLogosByLeague, teamCodes } from "../../utils/api.ts";
import "./TeamSelect.css";
import { Group, MultiSelect, MultiSelectProps, Avatar } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type TeamSelectProps = {
  league: string;
};

const iconProps = {
  stroke: 1.5,
  color: "currentColor",
  opacity: 0.6,
  size: 18,
};

const TeamSelect = (props: TeamSelectProps) => {
  const [teams, setTeams] = useState<string[]>();
  const teamLogos: Record<string, string> = getTeamLogosByLeague(props.league);
  const renderMultiSelectOption: MultiSelectProps["renderOption"] = ({
    option,
    checked,
  }) => (
    <Group flex="1" gap="xs">
      <Avatar src={teamLogos[option.value]} size={36} radius="xl" />
      {option.value}
      {checked && (
        <IconCheck style={{ marginInlineStart: "auto" }} {...iconProps} />
      )}
    </Group>
  );

  useEffect(() => {
    chrome.storage.sync.get([`${props.league}Teams`], (results) => {
      setTeams(results[`${props.league}Teams`]);
    });
  }, [props.league]);

  /**
   * Updates the storage with the selected teams and the 'teams' variable
   * @param newTeams array of newly selected teams
   */
  function handleTeamChange(newTeams: string[]): void {
    setTeams(newTeams);
    const teamObj: Record<string, string[]> = {};
    teamObj[`${props.league}Teams`] = newTeams;
    chrome.storage.sync.set(teamObj).then();
  }

  return (
    <MultiSelect
      label={props.league.toUpperCase()}
      data={teamCodes[props.league].split(" ")}
      value={teams}
      onChange={handleTeamChange}
      maxDropdownHeight={200}
      renderOption={renderMultiSelectOption}
      maxValues={2}
      searchable
      width={200}
    />
  );
};

export default TeamSelect;

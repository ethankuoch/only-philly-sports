import { useState } from "react";
import { getTeamLogosByLeague, League, teamCodes } from "../../utils/api.ts";
import "./TeamSelect.css";
import { Group, MultiSelect, MultiSelectProps, Avatar } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

type TeamSelectProps = {
  league: League;
};

const iconProps = {
  stroke: 1.5,
  color: "currentColor",
  opacity: 0.6,
  size: 18,
};

const TeamSelect = (props: TeamSelectProps) => {
  const [team, setTeam] = useState<string[]>(["PHI"]);
  const teamLogos = getTeamLogosByLeague(props.league);

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

  return (
    <MultiSelect
      label={props.league.toUpperCase()}
      data={teamCodes[props.league].split(" ")}
      // defaultValue={team}
      value={team}
      onChange={setTeam}
      maxDropdownHeight={200}
      renderOption={renderMultiSelectOption}
      maxValues={2}
      clearable
      searchable
    />
  );
};

export default TeamSelect;

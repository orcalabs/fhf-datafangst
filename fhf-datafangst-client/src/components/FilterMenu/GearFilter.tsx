import { Box, Typography } from "@mui/material";
import { GearGroup } from "generated/openapi";
import { FC } from "react";
import {
  selectGearFilterStatsSorted,
  selectGearGroupsMap,
  useAppSelector,
} from "store";
import { Bar } from "./Bar";

interface Props {
  value?: GearGroup[];
  onChange: (_?: GearGroup[]) => void;
  statsSelector?: typeof selectGearFilterStatsSorted;
}

export const GearFilter: FC<Props> = (props) => {
  const gearGroups = useAppSelector(selectGearGroupsMap);
  const gearFilterStats = useAppSelector(
    props.statsSelector ?? selectGearFilterStatsSorted,
  );

  if (!gearFilterStats.length) {
    return <></>;
  }

  const value = props.value ?? [];

  const onChange = (value: GearGroup[]) =>
    props.onChange(value.length ? value : undefined);

  const total = gearFilterStats.sum((v) => v.value);

  const handleClick = (id: number) => {
    const gearGroup = gearGroups[id];
    if (gearGroup)
      onChange(
        value.some((gearGroup) => gearGroup.id === id)
          ? value.filter((g) => g.id !== id)
          : [...value, gearGroup],
      );
  };

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Redskap
      </Typography>
      <Box>
        {gearFilterStats.map((val, i) => (
          <Box
            key={i}
            sx={{ ":hover": { cursor: "pointer" } }}
            onClick={() => handleClick(val.id)}
          >
            <Bar
              length={(val.value / total) * 100}
              label={gearGroups[val.id]?.name}
              value={val.value}
              selected={value.some((g) => g.id === val.id)}
            />
          </Box>
        ))}
      </Box>
    </>
  );
};

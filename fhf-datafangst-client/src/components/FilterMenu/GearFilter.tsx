import { Box, Typography } from "@mui/material";
import { GearGroup } from "generated/openapi";
import { FilterStats } from "models";
import { FC } from "react";
import { selectGearFilterStats, selectGearGroups, useAppSelector } from "store";
import { Bar } from "./Bar";

interface Props {
  value?: GearGroup[];
  onChange: (_?: GearGroup[]) => void;
}

export const GearFilter: FC<Props> = (props) => {
  const gearGroups = useAppSelector(selectGearGroups);
  const gearFilterStats = useAppSelector(selectGearFilterStats);
  const value = props.value ?? [];
  const onChange = (value: GearGroup[]) =>
    props.onChange(value.length ? value : undefined);

  const total: number = gearFilterStats.reduce(
    (acc: number, obj: FilterStats) => {
      return acc + obj.value;
    },
    0,
  );

  const handleClick = (id: number) => {
    const gearGroup = gearGroups[id];
    if (gearGroup) {
      if (value.some((gearGroup) => gearGroup.id === id)) {
        onChange(value.filter((lg) => lg.id !== id));
      } else {
        onChange([...value, gearGroup]);
      }
    }
  };

  if (!gearFilterStats.length) {
    return <></>;
  }

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Redskap
      </Typography>
      <Box>
        {[...gearFilterStats]
          .sort((a, b) => b.value - a.value)
          .map((val, i) => {
            const barLength = (val.value / total) * 100;

            return (
              <Box
                key={i}
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleClick(val.id)}
              >
                <Bar
                  length={barLength}
                  label={gearGroups[val.id]?.name}
                  value={val.value}
                  selected={value.some(
                    (lengthGroup) => lengthGroup.id === val.id,
                  )}
                />
              </Box>
            );
          })}
      </Box>
    </>
  );
};

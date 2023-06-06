import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { LengthGroup, LengthGroupsMap } from "models";
import { selectVesselLengthFilterStatsSorted, useAppSelector } from "store";
import { Bar } from "./Bar";

interface Props {
  value?: LengthGroup[];
  onChange: (_?: LengthGroup[]) => void;
  statsSelector?: typeof selectVesselLengthFilterStatsSorted;
  removeIfSingleEntry?: boolean;
}

export const LengthGroupFilter: FC<Props> = (props) => {
  const value = props.value ?? [];
  const vesselLengthStats = useAppSelector(
    props.statsSelector ?? selectVesselLengthFilterStatsSorted,
  );

  if (!vesselLengthStats.length) {
    return <></>;
  }

  if (vesselLengthStats.length === 1 && props.removeIfSingleEntry) {
    return <></>;
  }

  const total = vesselLengthStats.sum((v) => v.value);

  const onChange = (value: LengthGroup[]) =>
    props.onChange(value.length ? value : undefined);

  const handleClick = (id: number) => {
    const lengthGroup = LengthGroupsMap[id];
    if (lengthGroup)
      onChange(
        value.some((lengthGroup) => lengthGroup.id === id)
          ? value.filter((l) => l.id !== id)
          : [...value, lengthGroup],
      );
  };

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Fartøylengde
      </Typography>
      <Box>
        {vesselLengthStats.map((val, i) => (
          <Box
            key={i}
            sx={{ ":hover": { cursor: "pointer" } }}
            onClick={() => handleClick(val.id)}
          >
            <Bar
              length={total > 0 ? (val.value / total) * 100 : 0}
              label={LengthGroupsMap[val.id].name}
              value={val.value}
              selected={value.some((l) => l.id === val.id)}
            />
          </Box>
        ))}
      </Box>
    </>
  );
};

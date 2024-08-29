import { Box, Typography } from "@mui/material";
import { VesselLengthGroup } from "generated/openapi";
import { LengthGroup, LengthGroupsMap } from "models";
import { FC } from "react";
import { Bar } from "./Bar";

interface Props {
  value?: LengthGroup[];
  onChange: (_?: LengthGroup[]) => void;
  stats: { id: VesselLengthGroup; value: number }[];
  removeIfSingleEntry?: boolean;
}

export const LengthGroupFilter: FC<Props> = (props) => {
  const value = props.value ?? [];

  if (!props.stats.length) {
    return <></>;
  }

  if (props.stats.length === 1 && props.removeIfSingleEntry) {
    return <></>;
  }

  const total = props.stats.sum((v) => v.value);

  const onChange = (value: LengthGroup[]) =>
    props.onChange(value.length ? value : undefined);

  const handleClick = (id: VesselLengthGroup) => {
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
        {props.stats.map((val, i) => (
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

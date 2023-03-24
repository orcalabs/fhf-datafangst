import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { LengthGroup, LengthGroupCodes } from "models";
import { selectVesselLengthFilterStats, useAppSelector } from "store";
import { Bar } from "./Bar";

interface Props {
  value?: LengthGroup[];
  onChange: (_?: LengthGroup[]) => void;
}

export const LengthGroupFilter: FC<Props> = (props) => {
  const value = props.value ?? [];
  const vesselLengthStats = useAppSelector(selectVesselLengthFilterStats);

  const total: number = vesselLengthStats.reduce((acc: number, obj) => {
    return acc + obj.value;
  }, 0);

  const onChange = (value: LengthGroup[]) =>
    props.onChange(value.length ? value : undefined);

  const handleClick = (id: number) => {
    const lengthGroup = LengthGroupCodes[id];
    if (lengthGroup) {
      if (value.some((lengthGroup) => lengthGroup.id === id)) {
        onChange(value.filter((lg) => lg.id !== id));
      } else {
        onChange([...value, lengthGroup]);
      }
    }
  };

  if (!vesselLengthStats.length) {
    return <></>;
  }

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Fartøylengde
      </Typography>

      <Box>
        {[...vesselLengthStats]
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
                  label={LengthGroupCodes[val.id].name}
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

import { FC, useState } from "react";
import { Box, Button, Collapse, Typography } from "@mui/material";
import {
  selectSpeciesFilterStats,
  selectSpeciesGroups,
  useAppSelector,
} from "store";
import { SpeciesGroup } from "generated/openapi";
import { Bar } from "./Bar";
import { FilterStats } from "models";
import ExpandMoreSharpIcon from "@mui/icons-material/ExpandMoreSharp";
import ExpandLessSharpIcon from "@mui/icons-material/ExpandLessSharp";

interface Props {
  value?: SpeciesGroup[];
  onChange: (_?: SpeciesGroup[]) => void;
}

export const SpecieFilter: FC<Props> = (props) => {
  const speciesGroups = useAppSelector(selectSpeciesGroups);
  const speciesFilterStats = useAppSelector(selectSpeciesFilterStats);
  const value = props.value ?? [];
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleExpandChange = () => {
    setExpanded((prev) => !prev);
  };

  const onChange = (value: SpeciesGroup[]) =>
    props.onChange(value.length ? value : undefined);

  const total: number = speciesFilterStats.reduce(
    (acc: number, obj: FilterStats) => {
      return acc + obj.value;
    },
    0,
  );

  const handleClick = (id: number) => {
    const speciesGroup = speciesGroups[id];
    if (speciesGroup) {
      if (value.some((speciesGroup) => speciesGroup.id === id)) {
        onChange(value.filter((lg) => lg.id !== id));
      } else {
        onChange([...value, speciesGroup]);
      }
    }
  };

  if (!speciesFilterStats.length) {
    return <></>;
  }

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Art
      </Typography>
      <Box>
        {/* Magic number: 30 = 20px bar height, 2px border, 8px margin */}
        <Collapse in={expanded} collapsedSize={32 * 7}>
          {[...speciesFilterStats]
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
                    label={speciesGroups[val.id]?.name}
                    value={val.value}
                    selected={value.some(
                      (lengthGroup) => lengthGroup.id === val.id,
                    )}
                  />
                </Box>
              );
            })}
        </Collapse>
        <Box sx={{ width: "100%" }}>
          <Button
            disableRipple
            size="small"
            sx={{
              float: "right",
              fontSize: 13,
              color: "white",
              borderRadius: 0,
              ":hover": {
                borderRadius: 0,
              },
            }}
            onClick={() => handleExpandChange()}
            startIcon={
              expanded ? <ExpandLessSharpIcon /> : <ExpandMoreSharpIcon />
            }
          >
            {expanded ? "Vis mindre" : "Vis mer"}
          </Button>
        </Box>
      </Box>
    </>
  );
};

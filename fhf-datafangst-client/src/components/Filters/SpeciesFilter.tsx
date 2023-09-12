import { FC, useEffect, useState } from "react";
import { Box, Button, Collapse, Typography } from "@mui/material";
import { selectSpeciesGroupsMap, useAppSelector } from "store";
import { SpeciesGroup } from "generated/openapi";
import { Bar } from "./Bar";
import ExpandMoreSharpIcon from "@mui/icons-material/ExpandMoreSharp";
import ExpandLessSharpIcon from "@mui/icons-material/ExpandLessSharp";

const NUM_BARS = 7;

interface Props {
  value?: SpeciesGroup[];
  onChange: (_?: SpeciesGroup[]) => void;
  stats: { id: any; value: number }[];
}

export const SpeciesFilter: FC<Props> = (props) => {
  const speciesGroups = useAppSelector(selectSpeciesGroupsMap);
  const [expanded, setExpanded] = useState<boolean>(false);

  // Keep SpeciesFilter expanded if hidden options are selected
  useEffect(() => {
    let expand = false;
    if (props.value?.length) {
      value.forEach((sg, _) => {
        const selectedIdx = props.stats.findIndex((item) => item.id === sg.id);
        if (selectedIdx > NUM_BARS - 1) {
          expand = true;
        } else {
          expand = expand || false;
        }
      });
    }
    setExpanded(expand);
  }, [props.value]);

  if (!props.stats.length) {
    return <></>;
  }

  const value = props.value ?? [];

  const handleExpandChange = () => {
    setExpanded((prev) => !prev);
  };

  const onChange = (value: SpeciesGroup[]) =>
    props.onChange(value.length ? value : undefined);

  const total = props.stats.sum((v) => v.value);

  const handleClick = (id: number) => {
    const speciesGroup = speciesGroups[id];
    if (speciesGroup)
      onChange(
        value.some((speciesGroup) => speciesGroup.id === id)
          ? value.filter((s) => s.id !== id)
          : [...value, speciesGroup],
      );
  };

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Art
      </Typography>
      <Box>
        {/* Magic number: 34 = 26px bar height, 8px margin */}
        <Collapse
          in={expanded}
          collapsedSize={
            props.stats.length >= NUM_BARS
              ? 34 * NUM_BARS
              : 34 * props.stats.length
          }
        >
          {props.stats.map((val, i) => (
            <Box
              key={i}
              sx={{ ":hover": { cursor: "pointer" } }}
              onClick={() => handleClick(val.id)}
            >
              <Bar
                length={total > 0 ? (val.value / total) * 100 : 0}
                label={speciesGroups[val.id]?.name}
                value={val.value}
                selected={value.some((s) => s.id === val.id)}
              />
            </Box>
          ))}
        </Collapse>
        {props.stats.length >= NUM_BARS && (
          <Box sx={{ width: "100%", pb: 2 }}>
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
        )}
      </Box>
    </>
  );
};

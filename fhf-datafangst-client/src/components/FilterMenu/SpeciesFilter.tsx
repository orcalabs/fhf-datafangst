import { FC, useState } from "react";
import { Box, Button, Collapse, Typography } from "@mui/material";
import {
  selectSpeciesFilterStatsSorted,
  selectSpeciesGroupsMap,
  useAppSelector,
} from "store";
import { SpeciesGroup } from "generated/openapi";
import { Bar } from "./Bar";
import ExpandMoreSharpIcon from "@mui/icons-material/ExpandMoreSharp";
import ExpandLessSharpIcon from "@mui/icons-material/ExpandLessSharp";

interface Props {
  value?: SpeciesGroup[];
  onChange: (_?: SpeciesGroup[]) => void;
}

export const SpeciesFilter: FC<Props> = (props) => {
  const speciesGroups = useAppSelector(selectSpeciesGroupsMap);
  const speciesFilterStats = useAppSelector(selectSpeciesFilterStatsSorted);
  const [expanded, setExpanded] = useState<boolean>(false);

  if (!speciesFilterStats.length) {
    return <></>;
  }

  const value = props.value ?? [];

  const handleExpandChange = () => {
    setExpanded((prev) => !prev);
  };

  const onChange = (value: SpeciesGroup[]) =>
    props.onChange(value.length ? value : undefined);

  const total = speciesFilterStats.sum((v) => v.value);

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
        {/* Magic number: 30 = 20px bar height, 2px border, 8px margin */}
        <Collapse in={expanded} collapsedSize={32 * 7}>
          {speciesFilterStats.map((val, i) => (
            <Box
              key={i}
              sx={{ ":hover": { cursor: "pointer" } }}
              onClick={() => handleClick(val.id)}
            >
              <Bar
                length={(val.value / total) * 100}
                label={speciesGroups[val.id]?.name}
                value={val.value}
                selected={value.some((s) => s.id === val.id)}
              />
            </Box>
          ))}
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

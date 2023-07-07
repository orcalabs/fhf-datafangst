import {
  Box,
  OutlinedInput,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { middle } from "utils";

interface Props {
  value?: [number, number];
  onChange: (_: [number, number]) => void;
  minWeight?: number;
  maxWeight?: number;
}

export const WeightFilter: FC<Props> = (props) => {
  const onChange = props.onChange;
  const minWeight = props.minWeight ?? 0;
  const maxWeight = props.maxWeight ?? 200000;

  const [weight, _setWeight] = useState<[number, number]>(
    props.value ?? [minWeight, maxWeight],
  );

  const setWeight = (newValue: [number, number]) =>
    _setWeight([
      middle(minWeight, newValue[0], maxWeight),
      middle(minWeight, newValue[1], maxWeight),
    ]);

  const [unit, setUnit] = useState("tonn");

  const handleCommit = (newValue: [number, number], unit: string) =>
    onChange(
      unit === "kg" ? newValue : [newValue[0] * 1000, newValue[1] * 1000],
    );

  const handleCommitSlider = (_: any, newValue: number | number[]) =>
    handleCommit(newValue as [number, number], unit);

  const handleCommitMax = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => handleCommit([weight[0], +event.target.value], unit);

  const handleCommitMin = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => handleCommit([+event.target.value, weight[1]], unit);

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Vekt
      </Typography>
      <Slider
        sx={{
          left: "5px",
          width: "calc(100% - 10px)",
          color: "secondary.main",
        }}
        value={weight}
        onChange={(_: Event, newValue: number | number[]) => {
          setWeight(newValue as [number, number]);
        }}
        onChangeCommitted={handleCommitSlider}
        valueLabelDisplay="off"
        min={minWeight}
        max={maxWeight}
        disableSwap
      />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          "& .Mui-selected": {
            bgcolor: "secondary.main",
            color: "black",
            ":hover": {
              bgcolor: "#8FC6C1",
            },
          },
        }}
      >
        <OutlinedInput
          sx={{ width: 110, color: "black" }}
          value={weight[0]}
          size="small"
          onChange={(event) => setWeight([+event.target.value, weight[1]])}
          onBlur={handleCommitMin}
          inputProps={{ type: "number", inputMode: "numeric" }}
        />
        <ToggleButtonGroup
          sx={{ height: 25, textAlign: "center" }}
          color="secondary"
          size="small"
          value={unit}
          exclusive
          onChange={(_: any, newValue: string | null) => {
            if (newValue) {
              setUnit(newValue);
              handleCommit(weight, newValue);
            }
          }}
        >
          <ToggleButton sx={{ borderColor: "secondary.main" }} value="kg">
            Kg
          </ToggleButton>
          <ToggleButton sx={{ borderColor: "secondary.main" }} value="tonn">
            Tonn
          </ToggleButton>
        </ToggleButtonGroup>
        <OutlinedInput
          sx={{ width: 110, float: "right", color: "black" }}
          value={weight[1]}
          size="small"
          onChange={(event) => setWeight([weight[0], +event.target.value])}
          onBlur={handleCommitMax}
          inputProps={{ type: "number", inputMode: "numeric" }}
        />
      </Box>
    </>
  );
};

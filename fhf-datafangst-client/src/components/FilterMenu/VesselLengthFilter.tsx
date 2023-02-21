import {
  InputAdornment,
  OutlinedInput,
  Slider,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { middle } from "utils";

interface Props {
  value?: [number, number];
  onChange: (_: [number, number]) => void;
  minLength?: number;
  maxLength?: number;
}

export const VesselLengthFilter: FC<Props> = (props) => {
  const onChange = props.onChange;
  const minLength = props.minLength ?? 0;
  const maxLength = props.maxLength ?? 150;

  const [length, _setLength] = useState<number[]>(
    props.value ?? [minLength, maxLength],
  );

  const setLength = (newValue: [number, number]) =>
    _setLength([
      middle(minLength, newValue[0], maxLength),
      middle(minLength, newValue[1], maxLength),
    ]);

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Fartøylengde
      </Typography>
      <Slider
        sx={{
          left: "5px",
          width: "calc(100% - 10px)",
          color: "white",
        }}
        value={length}
        onChange={(_: Event, newValue: number | number[]) => {
          setLength(newValue as [number, number]);
        }}
        onChangeCommitted={(_: any, newValue: number | number[]) =>
          onChange(newValue as [number, number])
        }
        valueLabelDisplay="off"
        min={minLength}
        max={maxLength}
        disableSwap
      />
      <OutlinedInput
        sx={{ width: 110, color: "black" }}
        value={length[0]}
        size="small"
        onChange={(event) => setLength([+event.target.value, length[1]])}
        onBlur={(
          event: React.FocusEvent<
            HTMLInputElement | HTMLTextAreaElement,
            Element
          >,
        ) => onChange([+event.target.value, length[1]])}
        endAdornment={<InputAdornment position="end">m</InputAdornment>}
        inputProps={{ type: "number", inputMode: "numeric" }}
      />
      <OutlinedInput
        sx={{ width: 110, float: "right", color: "black" }}
        value={length[1]}
        size="small"
        onChange={(event) => setLength([length[0], +event.target.value])}
        onBlur={(
          event: React.FocusEvent<
            HTMLInputElement | HTMLTextAreaElement,
            Element
          >,
        ) => onChange([length[0], +event.target.value])}
        endAdornment={<InputAdornment position="end">m</InputAdornment>}
        inputProps={{ type: "number", inputMode: "numeric" }}
      />
    </>
  );
};

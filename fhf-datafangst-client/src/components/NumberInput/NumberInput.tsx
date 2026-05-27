import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useState, type FC, type ReactNode } from "react";

interface Props {
  title?: ReactNode;
  placeholder?: string;
  endAdornment?: string;
  error?: string;
  decimal?: boolean;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export const NumberInput: FC<Props> = ({
  title,
  placeholder,
  endAdornment,
  error,
  decimal,
  value: _value,
  onChange,
}) => {
  const value =
    _value === undefined ? "" : decimal ? _value.toString() : _value.toFixed(0);

  const [input, setInput] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setInput(value);
    setPrevValue(value);
  }

  const parse = decimal
    ? (v: string) =>
        /^[0-9]+(\.[0-9]*)?$/.test(v) ? Number.parseFloat(v) : NaN
    : (v: string) => (/^[0-9]+$/.test(v) ? Number.parseInt(v) : NaN);

  return (
    <Stack spacing={0.5}>
      {title && <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>}
      <TextField
        size="small"
        variant="outlined"
        value={input}
        placeholder={placeholder}
        error={!!error}
        helperText={error}
        sx={{
          width: 175,
          bgcolor: "white",
          "& .MuiInputBase-root": {
            borderRadius: 0,
          },
        }}
        onChange={(e) => {
          if (e.target.value === "" || Number.isFinite(parse(e.target.value))) {
            setInput(e.target.value);
          }
        }}
        onBlur={(e) => {
          const num = parse(e.target.value);
          onChange(Number.isFinite(num) ? num : undefined);
        }}
        slotProps={{
          input: {
            inputMode: decimal ? "decimal" : "numeric",
            endAdornment: (
              <InputAdornment position="end">
                {input && endAdornment && (
                  <Typography sx={{ fontSize: "0.9rem" }}>
                    {endAdornment}
                  </Typography>
                )}
              </InputAdornment>
            ),
          },
        }}
      />
    </Stack>
  );
};

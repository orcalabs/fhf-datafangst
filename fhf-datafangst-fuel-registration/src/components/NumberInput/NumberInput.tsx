import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { type FC, type ReactNode } from "react";
import theme from "~/app/theme";
import { numberInputLimiter } from "~/utils";

interface Props {
  title?: ReactNode;
  placeholder?: string;
  endAdornment?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}

export const NumberInput: FC<Props> = ({
  title,
  placeholder,
  endAdornment,
  error,
  value,
  onChange,
}) => {
  return (
    <Stack spacing={0.5}>
      {title && (
        <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500] }}>
          {title}
        </Typography>
      )}
      <TextField
        sx={{ width: 205 }}
        variant="outlined"
        color="secondary"
        value={value}
        placeholder={placeholder}
        error={!!error}
        helperText={error}
        onKeyDown={numberInputLimiter}
        onChange={(event) => onChange(event.target.value)}
        slotProps={{
          htmlInput: {
            inputMode: "numeric",
            pattern: "[0-9]*",
          },
          input: {
            inputMode: "numeric",
            endAdornment: (
              <InputAdornment position="end">
                {value && endAdornment && (
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

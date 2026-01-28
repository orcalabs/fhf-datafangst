import { Box, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { endOfDay, isValid, startOfDay } from "date-fns";
import { nb } from "date-fns/locale";
import { FC, useState } from "react";

export class DateRange {
  rawStart?: Date;
  rawEnd?: Date;

  get start() {
    return isValid(this.rawStart)
      ? startOfDay(this.rawStart!)
      : this.rawEnd
        ? new Date(0)
        : undefined;
  }

  get end() {
    return isValid(this.rawEnd)
      ? endOfDay(this.rawEnd!)
      : this.rawStart
        ? new Date()
        : undefined;
  }

  constructor(start?: Date | null, end?: Date | null) {
    this.rawStart = start ?? undefined;
    this.rawEnd = end ?? undefined;
  }
}

interface Props {
  value?: DateRange;
  onChange: (_?: DateRange) => void;
  validateRange?: boolean;
}

export const DateFilter: FC<Props> = (props) => {
  const { value, onChange, validateRange } = props;
  const [error, setError] = useState<boolean>(false);

  const handleStartDateChange = (date: Date | null) => {
    setError(false);
    if (value?.rawEnd && date && date >= value?.rawEnd) {
      setError(true);
    }
    onChange(new DateRange(date, value?.rawEnd));
  };

  const handleEndDateChange = (date: Date | null) => {
    setError(false);
    if (value?.rawStart && date && date <= value?.rawStart) {
      setError(true);
    }
    onChange(new DateRange(value?.rawStart, date));
  };

  return (
    <>
      <Typography sx={{ pb: 1.5 }} fontWeight="bold">
        Dato
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nb}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            "& .MuiButtonBase-root": {
              borderRadius: 0,
              "&:hover": {
                borderRadius: 0,
              },
              "&.clearButton": {
                p: 0,
              },
            },
            "& .MuiIconButton-sizeMedium": {
              color: "secondary.main",
            },
            "& .MuiFormControl-root": {
              width: "49%",
            },
            "& .MuiInputLabel-root": {
              color: "black",
            },
          }}
        >
          <DatePicker
            label={"Fra"}
            slotProps={{
              textField: {
                size: "small",
                error: validateRange && error,
                helperText:
                  validateRange &&
                  error &&
                  "Ugyldig datointervall. Fra-dato må være mindre enn Til-dato",
              },
              popper: { disablePortal: true },
              field: { clearable: true },
            }}
            onChange={handleStartDateChange}
            value={value?.rawStart ?? null}
            minDate={new Date("2011-01-01")}
            maxDate={new Date()}
          />
          <DatePicker
            label={"Til"}
            slotProps={{
              textField: {
                size: "small",
                error: validateRange && error,
              },
              popper: { disablePortal: true },
              field: { clearable: true },
            }}
            value={value?.rawEnd ?? null}
            minDate={new Date("2011-01-01")}
            maxDate={new Date()}
            onChange={handleEndDateChange}
          />
        </Box>
      </LocalizationProvider>
    </>
  );
};

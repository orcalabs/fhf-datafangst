import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { nb } from "date-fns/locale";
import { endOfDay, isValid, startOfDay } from "date-fns";

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
}

export const DateFilter: FC<Props> = (props) => {
  const { value, onChange } = props;

  const handleStartDateChange = (date: Date | null) =>
    onChange(new DateRange(date, value?.rawEnd));

  const handleEndDateChange = (date: Date | null) =>
    onChange(new DateRange(value?.rawStart, date));

  return (
    <>
      <Typography sx={{ pb: 1 }} fontWeight="bold">
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
            slotProps={{ textField: { size: "small" } }}
            onChange={handleStartDateChange}
            value={value?.rawStart ?? null}
            minDate={new Date("2011-01-01")}
            maxDate={value?.rawEnd ?? new Date()}
          />
          <DatePicker
            label={"Til"}
            slotProps={{ textField: { size: "small" } }}
            value={value?.rawEnd ?? null}
            maxDate={new Date()}
            minDate={value ? value.rawStart : new Date("2011-01-01")}
            onChange={handleEndDateChange}
          />
        </Box>
      </LocalizationProvider>
    </>
  );
};

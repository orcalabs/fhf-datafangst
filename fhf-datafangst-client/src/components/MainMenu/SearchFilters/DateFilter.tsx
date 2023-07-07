import { Box, TextField, Typography } from "@mui/material";
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
  hideLabel?: boolean;
}

export const DateFilter: FC<Props> = (props) => {
  const { value, onChange, hideLabel } = props;

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
            "& .PrivatePickersYear-yearButton": {
              borderRadius: 0,
            },
            "& .Mui-selected": {
              bgcolor: "#9FCFCA!important" as any,
            },
            "& .MuiIconButton-sizeMedium": {
              color: "secondary.main",
            },
            "& .MuiFormControl-root": {
              width: "49%",
            },
            "& .MuiOutlinedInput-root": {
              p: "6px",
            },
            "& .MuiOutlinedInput-input": {
              p: "3px 4px 2px 6px",
            },
            "& .MuiInputLabel-root": {
              color: "black",
            },
            "& .MuiPickersPopper-paper": {
              color: "black",
            },
          }}
        >
          <DatePicker
            onChange={handleStartDateChange}
            // DialogProps={{ sx: { color: "black" } }}
            // PopperProps={{ disablePortal: true }}
            label={hideLabel ? "" : "Fra"}
            value={value?.rawStart ?? null}
            minDate={new Date("2021-01-01")}
            maxDate={value?.rawEnd ?? new Date()}
            // renderInput={(props: any) => <TextField size="small" {...props} />}
            // OpenPickerButtonProps={{
            //   sx: {
            //     borderRadius: 0,
            //     mr: 0,
            //     svg: { width: 18, height: 18 },
            //   },
            // }}
          />
          <DatePicker
            label={hideLabel ? "" : "Til"}
            value={value?.rawEnd ?? null}
            // PopperProps={{ disablePortal: true }}
            maxDate={new Date()}
            minDate={value ? value.rawStart : new Date("2021-01-01")}
            onChange={handleEndDateChange}
            // renderInput={(props: any) => <TextField size="small" {...props} />}
            // OpenPickerButtonProps={{
            //   sx: {
            //     borderRadius: 0,
            //     mr: 0,
            //     svg: { width: 18, height: 18 },
            //   },
            // }}
          />
        </Box>
      </LocalizationProvider>
    </>
  );
};

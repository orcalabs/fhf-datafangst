import { Box, Chip, Stack, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import theme from "app/theme";
import {
  endOfDay,
  endOfMonth,
  endOfYear,
  getYear,
  isValid,
  startOfDay,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns";
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
  showShortCuts?: boolean;
}

export const DateFilter: FC<Props> = (props) => {
  const { value, onChange, validateRange, showShortCuts } = props;
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
        <Stack spacing={1.5}>
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
          {showShortCuts && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                "& .MuiChip-root": {
                  ":hover": {
                    bgcolor: theme.palette.grey[300],
                  },
                },
              }}
            >
              <Chip
                label="Denne måneden"
                onClick={() =>
                  onChange(new DateRange(startOfMonth(new Date()), new Date()))
                }
              />
              <Chip
                label="Forrige måned"
                onClick={() =>
                  onChange(
                    new DateRange(
                      startOfMonth(subMonths(new Date(), 1)),
                      endOfMonth(subMonths(new Date(), 1)),
                    ),
                  )
                }
              />
              <Chip
                label="Siste 3 måneder"
                onClick={() =>
                  onChange(
                    new DateRange(
                      startOfMonth(subMonths(new Date(), 3)),
                      endOfMonth(subMonths(new Date(), 1)),
                    ),
                  )
                }
              />
              {[subYears(new Date(), 2), subYears(new Date(), 1)].map(
                (yearDate, i) => (
                  <Chip
                    key={i}
                    label={getYear(yearDate)}
                    onClick={() =>
                      onChange(
                        new DateRange(
                          startOfYear(yearDate),
                          endOfYear(yearDate),
                        ),
                      )
                    }
                  />
                ),
              )}
            </Stack>
          )}
        </Stack>
      </LocalizationProvider>
    </>
  );
};

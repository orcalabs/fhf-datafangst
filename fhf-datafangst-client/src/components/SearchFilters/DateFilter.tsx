import { Box, Chip, Stack, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  endOfMonth,
  endOfYear,
  getYear,
  isEqual,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns";
import { nb } from "date-fns/locale";
import type { FC } from "react";
import { useState } from "react";
import { DateRange } from "~/api";
import theme from "~/app/theme";

interface Props {
  value?: DateRange;
  onChange: (_?: DateRange) => void;
  validateRange?: boolean;
  showShortCuts?: boolean;
  showDash?: boolean;
}

const dateRangeShortcuts = [
  {
    id: "previousMonth",
    label: "Forrige måned",
    getRange: () =>
      new DateRange(
        startOfMonth(subMonths(new Date(), 1)),
        endOfMonth(subMonths(new Date(), 1)),
      ),
  },
  {
    id: "last3Months",
    label: "Siste 3 måneder",
    getRange: () =>
      new DateRange(
        startOfMonth(subMonths(new Date(), 3)),
        endOfMonth(subMonths(new Date(), 1)),
      ),
  },
  ...[2, 1].map((yearsAgo) => {
    const date = subYears(new Date(), yearsAgo);

    return {
      id: `year${getYear(date)}`,
      label: String(getYear(date)),
      getRange: () => new DateRange(startOfYear(date), endOfYear(date)),
    };
  }),
  {
    id: "yearToDate",
    label: "Hittil i år",
    getRange: () => new DateRange(startOfYear(new Date()), new Date()),
  },
];

export const DateFilter: FC<Props> = (props) => {
  const { value, onChange, validateRange, showShortCuts, showDash } = props;
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

  const selectedShortcut = dateRangeShortcuts.find(({ getRange }) => {
    const range = getRange();
    if (!value?.start || !value.end) {
      return;
    }
    return isEqual(value.start, range.start!) && isEqual(value.end, range.end!);
  });

  return (
    <>
      <Typography sx={{ pb: 1.5, fontWeight: "bold" }}>Dato</Typography>
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
            {showDash && (
              <Typography
                sx={{
                  alignSelf: "center",
                  px: 1,
                  fontSize: "1.3rem",
                }}
              >
                -
              </Typography>
            )}
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
            <Stack direction="row" spacing={1}>
              {dateRangeShortcuts.map((shortcut) => {
                const selected = selectedShortcut?.id === shortcut.id;

                return (
                  <Chip
                    key={shortcut.id}
                    label={shortcut.label}
                    onClick={() => onChange(shortcut.getRange())}
                    // color={selected ? "primary" : "default"}
                    sx={
                      selected
                        ? {
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            "&:hover": { bgcolor: "primary.dark" },
                          }
                        : {
                            bgcolor: theme.palette.grey[300],
                            "&:hover": { bgcolor: theme.palette.grey[400] },
                          }
                    }
                  />
                );
              })}
            </Stack>
          )}
        </Stack>
      </LocalizationProvider>
    </>
  );
};

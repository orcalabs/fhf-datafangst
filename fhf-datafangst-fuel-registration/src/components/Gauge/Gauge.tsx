import ClearIcon from "@mui/icons-material/Clear";
import PostAddIcon from "@mui/icons-material/PostAdd";
import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import theme from "app/theme";
import { nb } from "date-fns/locale";
import { useTimestampUpdater } from "hooks/useTimestampUpdater";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { createFuelMeasurement, useAppDispatch } from "store";
import { numberInputLimiter } from "utils";

export const Gauge: FC = () => {
  const dispatch = useAppDispatch();
  const [inputDate, setInputDate] = useState<Date | null>(null);
  const [newFuel, setNewFuel] = useState<string>("");

  const minuteTime = useTimestampUpdater();
  const [timeValue, setTimeValue] = useState<Date | null>(null);

  useEffect(() => {
    setTimeValue(minuteTime);
  }, [minuteTime]);

  const resetForm = () => {
    setNewFuel("");
    setInputDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nb}>
      <Stack spacing={3} alignItems="center">
        <Stack spacing={2} alignItems="flex-start">
          <Stack spacing={0.5}>
            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.grey[500] }}
            >
              Tidspunkt
            </Typography>
            <DateTimePicker
              sx={{ width: 274 }}
              disableFuture
              slotProps={{
                field: {
                  clearable: true,
                },
              }}
              value={inputDate ?? timeValue}
              enableAccessibleFieldDOMStructure={false}
              onChange={(value) => setInputDate(value)}
            />
          </Stack>
          <Stack spacing={0.5}>
            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.grey[500] }}
            >
              Drivstoff
            </Typography>
            <TextField
              sx={{ width: 160 }}
              variant="outlined"
              color="secondary"
              value={newFuel}
              placeholder="Antall liter"
              onKeyDown={numberInputLimiter}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setNewFuel(event.target.value)
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {newFuel && (
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          liter
                        </Typography>
                      )}
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={3} sx={{ pt: 1 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              alignItems: "center",
              bgcolor: "grey.A400",
            }}
            disabled={newFuel === ""}
            startIcon={<PostAddIcon />}
            onClick={() => {
              dispatch(
                createFuelMeasurement({
                  timestamp: inputDate
                    ? inputDate.toISOString()
                    : new Date().toISOString(),
                  fuel: +newFuel,
                }),
              );

              resetForm();
            }}
          >
            Registrer
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            sx={{
              color: "#696F74",
              alignItems: "center",
            }}
            startIcon={<ClearIcon />}
            onClick={() => resetForm()}
          >
            Nullstill
          </Button>
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
};

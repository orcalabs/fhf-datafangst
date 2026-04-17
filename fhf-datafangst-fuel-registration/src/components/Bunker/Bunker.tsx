import ClearIcon from "@mui/icons-material/Clear";
import PostAddIcon from "@mui/icons-material/PostAdd";
import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import theme from "app/theme";
import { useTimestampUpdater } from "hooks/useTimestampUpdater";
import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  createFuelMeasurement,
  selectUserConsent,
  useAppDispatch,
  useAppSelector,
} from "store";
import { numberInputLimiter } from "utils";

export const Bunker: FC = () => {
  const dispatch = useAppDispatch();
  const consent = useAppSelector(selectUserConsent);
  const [inputDate, setInputDate] = useState<Date | null>(null);
  const [newFuel, setNewFuel] = useState<string>("");
  const [newFuelAfterBunker, setNewFuelAfterBunker] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const minuteTime = useTimestampUpdater();
  const [timeValue, setTimeValue] = useState<Date | null>(null);

  useEffect(() => {
    setTimeValue(minuteTime);
  }, [minuteTime]);

  const resetForm = () => {
    setNewFuel("");
    setInputDate(null);
    setNewFuelAfterBunker("");
  };

  useEffect(() => {
    if (newFuelAfterBunker.length > 0 && +newFuelAfterBunker <= +newFuel) {
      setError(true);
    } else {
      setError(false);
    }
  }, [newFuel, newFuelAfterBunker]);

  return (
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
            Drivstoff i tank <span style={{ fontStyle: "italic" }}>før</span>{" "}
            bunkring
          </Typography>
          <TextField
            sx={{ width: 205 }}
            variant="outlined"
            color="secondary"
            value={newFuel}
            placeholder="Antall liter"
            onKeyDown={numberInputLimiter}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setNewFuel(event.target.value)
            }
            slotProps={{
              htmlInput: {
                pattern: "[0-9]*",
              },
              input: {
                inputMode: "numeric",
                endAdornment: (
                  <InputAdornment position="end">
                    {newFuel && (
                      <Typography sx={{ fontSize: "0.9rem" }}>liter</Typography>
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
        <Stack spacing={0.5}>
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.grey[500] }}
          >
            Drivstoff i tank <span style={{ fontStyle: "italic" }}>etter</span>{" "}
            bunkring
          </Typography>
          <TextField
            sx={{
              width: 205,
              "& .MuiFormHelperText-root": {
                position: "absolute",
                top: 55,
                mx: "2px",
              },
            }}
            placeholder="Antall liter"
            color="secondary"
            variant="outlined"
            error={error}
            helperText={error ? "Må være større enn før bunkring" : ""}
            value={newFuelAfterBunker}
            onKeyDown={numberInputLimiter}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setNewFuelAfterBunker(event.target.value)
            }
            slotProps={{
              htmlInput: {
                pattern: "[0-9]*",
              },
              input: {
                inputMode: "numeric",
                endAdornment: (
                  <InputAdornment position="end">
                    {newFuelAfterBunker && (
                      <Typography sx={{ fontSize: "0.9rem" }}>liter</Typography>
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
          disabled={newFuel === "" || error || !newFuelAfterBunker || !consent}
          startIcon={<PostAddIcon />}
          onClick={() => {
            dispatch(
              createFuelMeasurement({
                timestamp: inputDate
                  ? inputDate.toISOString()
                  : new Date().toISOString(),
                fuel: +newFuel,
                fuelAfter: newFuelAfterBunker ? +newFuelAfterBunker : null,
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
      {!consent && (
        <Typography
          sx={{
            px: 5,
            display: "flex",
            color: "grey.A700",
            maxWidth: 450,
            textAlign: "center",
          }}
        >
          * Du har ikke gitt oss samtykke for bruk av data og kan derfor ikke
          registrere drivstoff. Samtykke kan endres fra menyen.
        </Typography>
      )}
    </Stack>
  );
};

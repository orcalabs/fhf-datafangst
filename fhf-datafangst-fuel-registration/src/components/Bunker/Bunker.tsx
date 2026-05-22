import ClearIcon from "@mui/icons-material/Clear";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Button, Stack, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import type { FC } from "react";
import { useState } from "react";
import theme from "~/app/theme";
import { NumberInput } from "~/components";
import { useTimestampUpdater } from "~/hooks/useTimestampUpdater";
import {
  createFuelMeasurement,
  selectUserConsent,
  useAppDispatch,
  useAppSelector,
} from "~/store";

export const Bunker: FC = () => {
  const dispatch = useAppDispatch();

  const minuteTime = useTimestampUpdater();

  const consent = useAppSelector(selectUserConsent);

  const [inputDate, setInputDate] = useState<Date | null>(null);
  const [newFuel, setNewFuel] = useState<string>("");
  const [newFuelAfterBunker, setNewFuelAfterBunker] = useState<string>("");

  const resetForm = () => {
    setNewFuel("");
    setInputDate(null);
    setNewFuelAfterBunker("");
  };

  const error =
    newFuelAfterBunker.length > 0 && +newFuelAfterBunker <= +newFuel;

  return (
    <Stack spacing={3} sx={{ alignItems: "center" }}>
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
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
            value={inputDate ?? minuteTime}
            onChange={(value) => setInputDate(value)}
          />
        </Stack>
        <NumberInput
          title={
            <>
              Drivstoff i tank <span style={{ fontStyle: "italic" }}>før</span>{" "}
              bunkring
            </>
          }
          placeholder="Antall liter"
          endAdornment="liter"
          value={newFuel}
          onChange={setNewFuel}
        />
        <NumberInput
          title={
            <>
              Drivstoff i tank{" "}
              <span style={{ fontStyle: "italic" }}>etter</span> bunkring
            </>
          }
          placeholder="Antall liter"
          endAdornment="liter"
          value={newFuelAfterBunker}
          error={error ? "Må være større enn før bunkring" : undefined}
          onChange={setNewFuelAfterBunker}
        />
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

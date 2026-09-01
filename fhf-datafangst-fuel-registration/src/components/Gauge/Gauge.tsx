import ClearIcon from "@mui/icons-material/Clear";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Button, Stack, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import type { FC } from "react";
import { useState } from "react";
import theme from "~/app/theme";
import { ConfirmModal, NumberInput } from "~/components";
import { useTimestampUpdater } from "~/hooks/useTimestampUpdater";
import {
  createFuelMeasurement,
  selectLastFuelMeasurement,
  selectUserConsent,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import type { Confirm } from "../ConfirmModal/ConfirmModal";

export const Gauge: FC = () => {
  const dispatch = useAppDispatch();

  const minuteTime = useTimestampUpdater();

  const consent = useAppSelector(selectUserConsent);
  const lastFuelMeasurement = useAppSelector(selectLastFuelMeasurement);
  const [inputDate, setInputDate] = useState<Date | null>(null);
  const [newFuel, setNewFuel] = useState<string>("");
  const [confirmRegistration, setConfirmRegistration] = useState<
    Confirm | undefined
  >(undefined);

  const resetForm = () => {
    setNewFuel("");
    setInputDate(null);
  };

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
              Drivstoffmåler / Flowmeter <span style={{ color: "red" }}>*</span>
            </>
          }
          placeholder="Antall liter"
          endAdornment="liter"
          value={newFuel}
          onChange={setNewFuel}
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
          disabled={newFuel === "" || !consent}
          startIcon={<PostAddIcon />}
          onClick={(e) => {
            if (lastFuelMeasurement && lastFuelMeasurement > +newFuel) {
              e.stopPropagation();
              setConfirmRegistration({
                message: `Denne målingen er lavere enn forrige registrerte verdi på
              ${lastFuelMeasurement} liter. Er du sikker på at tallet
              du har fylt inn er korrekt?`,
                onConfirm: () => {
                  dispatch(
                    createFuelMeasurement({
                      timestamp: inputDate
                        ? inputDate.toISOString()
                        : new Date().toISOString(),
                      fuel: +newFuel,
                    }),
                  );
                  resetForm();
                },
              });
            } else {
              dispatch(
                createFuelMeasurement({
                  timestamp: inputDate
                    ? inputDate.toISOString()
                    : new Date().toISOString(),
                  fuel: +newFuel,
                }),
              );
              resetForm();
            }
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
      {confirmRegistration && (
        <ConfirmModal
          {...confirmRegistration}
          open
          title="Bekreft måling"
          buttonConfirmText="Bekreft"
          confirmButtonColor="info"
          onClose={() => setConfirmRegistration(undefined)}
        />
      )}
    </Stack>
  );
};

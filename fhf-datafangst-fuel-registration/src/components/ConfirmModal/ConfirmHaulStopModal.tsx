import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useState, type FC } from "react";
import theme from "~/app/theme";
import {
  selectActiveUserHaul,
  selectLastFuelMeasurement,
  useAppSelector,
} from "~/store";
import { NumberInput } from "../NumberInput/NumberInput";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (fuelLiter: number, livingWeight?: number) => void;
}

export const ConfirmHaulStopModal: FC<Props> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [fuel, setFuel] = useState("");
  const [livingWeight, setLivingWeight] = useState("");
  const [confirmText, setConfirmText] = useState(false);
  const activeUserHaul = useAppSelector(selectActiveUserHaul);
  const lastFuelMeasurement = useAppSelector(selectLastFuelMeasurement);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableScrollLock
      sx={{
        "& .MuiDialog-paper": {
          padding: 1,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: "1.25rem" }}>Stopp pågående hal</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <NumberInput
            title={
              <>
                Drivstoffmåler / Flowmeter
                <span style={{ color: "red" }}>*</span>
              </>
            }
            placeholder="Antall liter"
            endAdornment="liter"
            value={fuel}
            onChange={setFuel}
          />
          <NumberInput
            title="Total levende vekt fanget"
            placeholder="Antall kg"
            endAdornment="kg"
            value={livingWeight}
            onChange={setLivingWeight}
          />
          {confirmText && (
            <Typography sx={{ width: 200, color: theme.palette.grey.A700 }}>
              * Denne målingen er lavere enn forrige registrerte verdi på{" "}
              {lastFuelMeasurement} liter. Er du sikker på at tallet du har fylt
              inn er korrekt?
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          variant="outlined"
          sx={{
            borderColor: "primary.main",
            "&:hover": { borderColor: "primary.dark" },
            width: 80,
          }}
          onClick={onClose}
        >
          Avbryt
        </Button>
        <Button
          sx={{ width: 120 }}
          color="error"
          disabled={fuel === ""}
          variant="contained"
          onClick={() => {
            if (
              !confirmText &&
              activeUserHaul &&
              lastFuelMeasurement &&
              +fuel < lastFuelMeasurement
            ) {
              setConfirmText(true);
              return;
            }
            onConfirm(+fuel);
            onClose();
          }}
        >
          Stopp hal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

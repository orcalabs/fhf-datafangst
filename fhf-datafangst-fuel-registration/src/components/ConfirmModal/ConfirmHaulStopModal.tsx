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
import { NumberInput } from "../NumberInput/NumberInput";

interface Props {
  open: boolean;
  startFuelLiter: number;
  onClose: () => void;
  onConfirm: (fuelLiter: number, livingWeight?: number) => void;
}

export const ConfirmHaulStopModal: FC<Props> = ({
  open,
  startFuelLiter,
  onClose,
  onConfirm,
}) => {
  const [fuel, setFuel] = useState("");
  const [livingWeight, setLivingWeight] = useState("");

  const error = fuel.length > 0 && +fuel >= +startFuelLiter;

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
            title="Drivstoff i tanken"
            placeholder="Antall liter"
            endAdornment="liter"
            error={
              error
                ? "Må være mindre enn angitt mengde når halet startet"
                : undefined
            }
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
          sx={{ width: 110 }}
          color="error"
          disabled={fuel === "" || +fuel >= startFuelLiter}
          variant="contained"
          onClick={() => {
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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type ChangeEvent, type FC } from "react";
import theme from "~/app/theme";
import { numberInputLimiter } from "~/utils";

interface Props {
  open: boolean;
  startFuelLiter: number;
  onClose: () => void;
  onConfirm: (fuelLiter: number) => void;
}

export const ConfirmHaulStopModal: FC<Props> = ({
  open,
  startFuelLiter,
  onClose,
  onConfirm,
}) => {
  const [fuel, setFuel] = useState<string>("");

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
        <Stack spacing={0.5}>
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.grey[500] }}
          >
            Drivstoff i tanken
          </Typography>
          <TextField
            sx={{ width: 205 }}
            error={error}
            helperText={
              error ? "Må være mindre enn angitt mengde når halet startet" : ""
            }
            variant="outlined"
            color="secondary"
            value={fuel}
            placeholder="Antall liter"
            onKeyDown={numberInputLimiter}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setFuel(event.target.value)
            }
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                pattern: "[0-9]*",
              },
              input: {
                inputMode: "numeric",
                endAdornment: (
                  <InputAdornment position="end">
                    {fuel && (
                      <Typography sx={{ fontSize: "0.9rem" }}>liter</Typography>
                    )}
                  </InputAdornment>
                ),
              },
            }}
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

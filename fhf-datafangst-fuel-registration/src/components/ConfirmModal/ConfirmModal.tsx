import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { FC } from "react";

export interface Confirm {
  message: string;
  onConfirm: () => void;
}

export interface Props {
  message: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: FC<Props> = ({
  message,
  open,
  onClose,
  onConfirm,
}) => {
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
        <Typography sx={{ fontSize: "1.25rem" }}>Bekreft sletting </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
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
          sx={{ width: 80 }}
          color="error"
          variant="contained"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Slett
        </Button>
      </DialogActions>
    </Dialog>
  );
};

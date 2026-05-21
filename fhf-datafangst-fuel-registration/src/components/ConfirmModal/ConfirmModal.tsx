import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { FC, ReactNode } from "react";

export interface Confirm {
  message: string;
  onConfirm: () => void;
}

interface Props {
  message: string;
  children?: ReactNode;
  open: boolean;
  title: string;
  buttonConfirmText: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: FC<Props> = ({
  message,
  open,
  title,
  buttonConfirmText,
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
        <Typography sx={{ fontSize: "1.25rem" }}>{title}</Typography>
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
          sx={{ width: 100 }}
          color="error"
          variant="contained"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {buttonConfirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

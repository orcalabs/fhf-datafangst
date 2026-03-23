import { Alert, Snackbar } from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
  resetFuelPostStatus,
  selectFuelPostStatus,
  useAppDispatch,
  useAppSelector,
} from "store";

export const ConfirmSnackbar: FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const fuelPostStatus = useAppSelector(selectFuelPostStatus);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setSnackbarOpen(false);

    // Used to avoid Alert color changing during Snackbars autoHideDuration.
    setTimeout(() => {
      dispatch(resetFuelPostStatus());
    }, 2000);
  };

  useEffect(() => {
    if (fuelPostStatus) {
      setSnackbarOpen(true);
    }
  }, [fuelPostStatus]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      {fuelPostStatus && (
        <Alert
          onClose={handleClose}
          severity={fuelPostStatus}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {fuelPostStatus === "success"
            ? "Fullført"
            : fuelPostStatus === "error"
              ? "En feil oppstod, prøv igjen senere."
              : ""}
        </Alert>
      )}
    </Snackbar>
  );
};

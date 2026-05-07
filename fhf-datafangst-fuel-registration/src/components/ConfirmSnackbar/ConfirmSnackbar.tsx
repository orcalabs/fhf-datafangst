import { Alert, Snackbar } from "@mui/material";
import type { FC } from "react";
import {
  resetFuelPostStatus,
  selectFuelPostStatus,
  useAppDispatch,
  useAppSelector,
} from "~/store";

export const ConfirmSnackbar: FC = () => {
  const dispatch = useAppDispatch();

  const fuelPostStatus = useAppSelector(selectFuelPostStatus);

  const handleClose = () => {
    dispatch(resetFuelPostStatus());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={!!fuelPostStatus}
      autoHideDuration={3000}
      onClose={handleClose}
      sx={{ position: "fixed", bottom: 8 }}
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

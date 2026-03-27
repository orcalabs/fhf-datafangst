import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "app/theme";
import { ConsentText } from "components";
import { FC } from "react";
import {
  selectUserConsent,
  updateUser,
  useAppDispatch,
  useAppSelector,
} from "store";

export interface Props {
  open: boolean;
  onClose: () => void;
}

export const ConsentDialog: FC<Props> = (props) => {
  const { open, onClose } = props;
  const dispatch = useAppDispatch();
  const smallDevice = useMediaQuery(theme.breakpoints.down(420));

  const consent = useAppSelector(selectUserConsent);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          padding: 1,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          Samtykke til data
        </Typography>
        <IconButton
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <ConsentText />
      </DialogContent>
      <DialogActions sx={{ pt: 2 }}>
        {consent === true ? (
          <Button
            size={smallDevice ? "small" : "large"}
            color="error"
            variant="contained"
            onClick={() => {
              dispatch(updateUser({ fuelConsent: false }));
              onClose();
            }}
          >
            Trekk tilbake samtykke
          </Button>
        ) : (
          <>
            <Button
              size={smallDevice ? "small" : "large"}
              color="info"
              variant="contained"
              onClick={() => {
                dispatch(updateUser({ fuelConsent: true }));
                onClose();
              }}
            >
              Jeg samtykker
            </Button>
            <Button
              size={smallDevice ? "small" : "large"}
              autoFocus
              variant="outlined"
              sx={{
                borderColor: "primary.main",
                "&:hover": { borderColor: "primary.dark" },
              }}
              onClick={() => {
                dispatch(updateUser({ fuelConsent: false }));
                onClose();
              }}
            >
              Jeg samtykker ikke
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

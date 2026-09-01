import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import type { FC } from "react";

export interface Props {
  open: boolean;
  onClose: () => void;
}

export const UserManual: FC<Props> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          p: 4,
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h2">Brukerveiledning</Typography>

          <Stack spacing={2}>
            <Typography>
              Fartøy som anvender drivstoffmålere (flowmeter) kan bruke
              applikasjonen til å registrere avlesninger av mengde drivstoff som
              er brukt til enhver tid.
            </Typography>
            <Typography>
              Regelmessige (og helst hyppige) målinger gir mer detaljert analyse
              av drivstofforbruket under ulike faser av fisket.
            </Typography>
            <Typography>
              For korrekt kalkulering av forbruket ditt bør flowmeteret leses av
              og registereres når:
            </Typography>
            <Stack sx={{ pl: 2, color: "secondary.dark" }}>
              <Typography variant="h6">1. Fartøyet forlater havn</Typography>
              <Typography variant="h6">2. Fartøyet ankommer havn</Typography>
              <Typography variant="h6">
                3: Redskap settes i sjøen (start av hal)
              </Typography>
              <Typography variant="h6">
                4: Redskap tas opp av sjøen (slutt av hal)
              </Typography>
            </Stack>
            <Typography sx={{ color: "error.dark" }}>
              NB: Dersom du nullstiller flowmeteret på ditt fartøy bør du
              registrere avlesninger både før og etter. (Etter nullstilling
              registreres verdien 0 i skjemaet).
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<CloseIcon />}
          autoFocus
          onClick={onClose}
          color="primary"
        >
          Lukk
        </Button>
      </DialogActions>
    </Dialog>
  );
};

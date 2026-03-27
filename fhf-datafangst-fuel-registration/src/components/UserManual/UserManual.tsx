import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { FC } from "react";

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
              Fyll ut skjemaet på siden for å registrere mengde drivstoff som er
              i tanken på ditt fartøy på gitte tidspunkt under toktet.
            </Typography>
            <Typography>
              Regelmessige (og helst hyppige) målinger gir mer detaljert analyse
              av drivstofforbruket under ulike faser av fisket.
            </Typography>
            <Typography>
              For korrekt kalkulering av forbruket må drivstoff registreres når:
            </Typography>
            <Stack sx={{ pl: 2, color: "secondary.dark" }}>
              <Typography variant="h6">1. Fartøyet forlater havn</Typography>
              <Typography variant="h6">2. Fartøyet ankommer havn</Typography>
              <Typography variant="h6">3. Fartøyet fyller drivstoff</Typography>
            </Stack>
            <Typography>
              I tillegg bør det registreres drivstoff før og etter
              fiskeoperasjoner (hal) for best mulig analyse av fisket.
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

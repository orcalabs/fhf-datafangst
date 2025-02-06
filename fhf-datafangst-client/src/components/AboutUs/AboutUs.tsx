import {
  Box,
  Dialog,
  DialogContent,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { FC } from "react";

export interface Props {
  open: boolean;
  onClose: () => void;
}

export const AboutUs: FC<Props> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogContent
        sx={{
          width: 700,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Stack spacing={2}>
          <Typography fontWeight="bold" fontSize="1.7rem">
            Om tjenesten
          </Typography>
          <Typography>
            DataFangst er produktet av et pågående forskningsprosjekt i regi av
            Fiskeri- og havbruksnæringens forskningsfinansiering (FHF).
            Prosjektet har som mål å utrede og utvikle en digital plattform for
            fangstanalyse og bærekraftsrapportering innenfor fiskeri.
          </Typography>
          <Typography>
            Applikasjonen er en pilot-tjeneste under utvikling og vil dermed
            kunne inneholde ufullstendig funksjonalitet, feil eller ha nedetid.
            Spørsmål eller tilbakemeldinger kan sendes til e-post under.
          </Typography>
          <Box>
            <Typography variant="h5">Kilder</Typography>
            <Stack>
              <Stack direction="row" justifyContent="space-between">
                <Link target="_blank" href="https://www.fiskeridir.no/">
                  Fiskeridirektoratet
                </Link>
                <Typography>
                  Fartøy- og fangstdata, Akvakulturregisteret, VMS, ERS
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Link target="_blank" href="https://www.kystverket.no/">
                  Kystverket
                </Link>
                <Typography>Posisjonsdata (AIS)</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Link target="_blank" href="https://www.barentswatch.no/">
                  BarentsWatch
                </Link>
                <Typography>Faste redskap</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Link target="_blank" href="https://www.mattilsynet.no/">
                  Mattilsynet
                </Link>
                <Typography>Godkjenningskoder for fiskemottak</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Link target="_blank" href="https://www.rafisklaget.no/">
                  Råfisklaget
                </Link>
                <Typography>
                  Aggregert prisdata fra landings- og sluttsedler
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Typography variant="h5">Kontakt</Typography>
            <Link href="mailto:post@orcalabs.no">post@orcalabs.no</Link>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

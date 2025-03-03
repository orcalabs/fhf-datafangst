import {
  Box,
  Dialog,
  DialogContent,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import theme from "app/theme";
import { FC, useState } from "react";

export interface Props {
  open: boolean;
  onClose: () => void;
}

export const UserManual: FC<Props> = ({ open, onClose }) => {
  const [subMenu, setSubMenu] = useState("live");

  const handleChange = (_: any, newValue: string) => {
    setSubMenu(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent
        sx={{
          bgcolor: "#EDF0F3",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          height: "85vh",
        }}
      >
        <Stack spacing={1}>
          <Typography fontWeight="bold" fontSize="1.7rem">
            Brukerveiledning
          </Typography>

          <Tabs
            value={subMenu}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiButtonBase-root.Mui-selected": {
                fontWeight: "bold",
              },
              borderBottom: `1px solid ${theme.palette.text.secondary}`,
            }}
          >
            <Tab
              value="live"
              label="Live kart"
              sx={{ color: theme.palette.grey[500] }}
            />
            <Tab
              value="area"
              label="Områder"
              sx={{ color: theme.palette.grey[500] }}
            />
            <Tab
              value="trips"
              label="Turer"
              sx={{ color: theme.palette.grey[500] }}
            />
            <Tab
              value="mypage"
              label="Mitt Fartøy"
              sx={{ color: theme.palette.grey[500] }}
            />
          </Tabs>
          <Box sx={{ pt: 1.5, px: 2 }}>
            {subMenu === "live" && <LiveMapDemo />}
            {subMenu === "area" && <AreaDemo />}
            {subMenu === "trips" && <TripsDemo />}
            {subMenu === "mypage" && <MyPageDemo />}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

interface VideoProps {
  src: string;
}

const LiveMapDemo: FC = () => {
  return (
    <Stack spacing={2}>
      <Typography>
        Søk etter eller klikk på fartøy i kartet for å se nåværende posisjon og
        status. Når en båt er valgt vil turene til båten vises på venstre side.
        På kartet vises sporet av nåværende tur dersom fartøyet har registrert
        en avgangsmelding (DEP). Hvis ikke vises spor fra siste 24 timer.
      </Typography>
      <Video src="/videos/live-page.mp4" />
    </Stack>
  );
};

const AreaDemo: FC = () => {
  return (
    <Stack spacing={2}>
      <Typography>
        Områder viser historisk rapportert fangst som et heatmap over et
        rutenett. I menyen til venstre kan man filtrere resultatene basert på
        tidsperiode, redskapstype, art, fartøylengde og spesifikke fartøy. Når
        man velger område(r) på kartet vil høyre meny vise mer detaljerte data
        om fangsten.
      </Typography>
      <Typography>
        På toppen av venstre venstre meny kan velge mellom to datasett:
        <ul style={{ margin: "6px", paddingInlineStart: "30px" }}>
          <li>
            <span style={{ fontStyle: "italic" }}> ERS:</span> Viser rapportert
            fangst fra fartøy over 15m. Her vil detaljer rundt spesifikke hal
            som er gjort vises når man klikker på et område i rutenettet.
          </li>
          <li>
            <span style={{ fontStyle: "italic" }}>Seddeldata:</span> Viser
            rapportert fangst fra alle fartøy. Inneholder ikke detaljer om
            spesifikke hal.
          </li>
        </ul>
      </Typography>
      <Typography>
        Nederst på kartet kan man anvende{" "}
        <span style={{ fontStyle: "italic" }}>Vis tidslinje</span> for å bla
        gjennom den valgte tidsperioden måned for måned.
      </Typography>
      <Video src="/videos/area-page.mp4" />
    </Stack>
  );
};

const TripsDemo: FC = () => {
  return (
    <Stack spacing={2}>
      <Typography>
        Turer viser beregnede tokt for fiskefartøy, basert på innrapporterte
        avgangs- og ankomstmeldinger, samt registerte landings- og sluttsedler.
      </Typography>
      <Typography>
        I venstre meny kan man filtrere turer basert på tidsperiode, fartøy,
        art, redskapstype, fartøylengde og vekt på levert fisk.
      </Typography>
      <Typography>
        Når man velger en tur vil menyen til høyre vise spesifikke detaljer om
        turen. I kartet vil man kunne se slepespor, registerte hal, redskap i
        sjøen og mottaket fangsten ble levert til.
      </Typography>
      <Typography>
        Mengde og presisjon på detaljert informasjon om en tur vil variere
        utifra tilgjengligheten i offentlige datakilder.
      </Typography>
      <Video src="/videos/trips-page.mp4" />
    </Stack>
  );
};

const MyPageDemo: FC = () => {
  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h5">Dine turer, områder og redskap</Typography>
        <Typography>
          Mitt fartøy inneholder tilpassede visninger av turer, områder og
          redskap for fartøyet du er tilknyttet hos BarentsWatch.
        </Typography>
        <Video src="/videos/myvessel-page.mp4" />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h5">Din statistikk</Typography>
        <Typography>
          Inneholder ulike statistikker og ytelsesmålinger for fartøyet ditt.
          Her vil man finne beregninger og analyser basert på innrapporterte
          data, samt AIS-sporet til fartøyet ditt.
        </Typography>
        <Video src="/videos/stats-page.mp4" />
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h5">Administrer fartøy</Typography>
        <Typography>
          Her finnes ulike menyer for å tilpasse ditt fartøy.
        </Typography>
        <Typography>
          <ul style={{ margin: "6px", paddingInlineStart: "30px" }}>
            <li>
              <span style={{ fontStyle: "italic" }}> Drivstoff:</span> Skjema
              for regelmessig peiling av drivstoff i tanken på fartøyet. Er man
              aktiv i bruken av dette vil all statistikk relatert til
              drivstofforbruket bli reelt istedenfor estimert.
            </li>
            <li>
              <span style={{ fontStyle: "italic" }}>Fartøy:</span> Skjema for å
              endre tekniske spesifikasjoner for fartøyet ditt. Ferdig utfylt
              data er hentet fra offentlige kilder og kan dermed være utdatert.
              Verdiene som oppgis brukes til å estimere drivstofforbruket til
              fartøyet ditt.
            </li>
            <li>
              <span style={{ fontStyle: "italic" }}>Følgeliste:</span> Liste
              over fartøy du ønsker å følge og sammenligne deg med. Data fra
              valgte fartøy vil vises i statistikk-siden.
            </li>
          </ul>
        </Typography>
        <Video src="/videos/settings-page.mp4" />
      </Stack>
    </Stack>
  );
};

const Video: FC<VideoProps> = ({ src }) => {
  return (
    <video playsInline muted autoPlay loop width="100%" height="100%">
      <source src={src} type="video/mp4" />
    </video>
  );
};

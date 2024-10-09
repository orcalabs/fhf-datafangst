import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Link,
  Modal,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoIcon from "assets/logos/logoIcon";
import { useAuth } from "oidc-react";
import { FC, useState } from "react";
import { selectIsLoggedIn, useAppSelector } from "store";

export const Header: FC = () => {
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const { signIn, signOutRedirect } = useAuth();
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  return (
    <AppBar
      position="fixed"
      sx={{
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        bgcolor: "primary.dark",
        zIndex: (theme) => theme.zIndex.drawer + 3,
        "& .MuiToolbar-root": { pl: 0, pr: 1, justifyContent: "center" },
      }}
    >
      <Toolbar
        variant="dense"
        sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr" }}
      >
        <Link
          sx={{ maxHeight: 50, gridColumn: 2 }}
          underline="none"
          href={window.location.origin}
        >
          <Stack direction="row" alignItems="center">
            <LogoIcon height={38} />
            <Typography color="white" variant="h4">
              DataFangst
            </Typography>
          </Stack>
        </Link>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ gridColumn: 3, justifySelf: "end" }}
          alignItems="center"
        >
          <Button
            sx={{ color: "white", textTransform: "none" }}
            onClick={() => setAboutModalOpen(true)}
          >
            Om tjenesten
          </Button>
          <Divider
            orientation="vertical"
            sx={{ bgcolor: "white", height: 12 }}
          />
          <Button
            sx={{
              justifySelf: "end",
              color: "white",
              textTransform: "none",
              fontWeight: "bold",
            }}
            onClick={() => {
              loggedIn ? signOutRedirect() : signIn();
            }}
            endIcon={
              loggedIn ? (
                <LogoutIcon />
              ) : (
                <AccountCircleIcon color="secondary" />
              )
            }
          >
            {loggedIn ? "Logg ut" : "Logg inn"}
          </Button>
        </Stack>
      </Toolbar>
      <Modal open={aboutModalOpen} onClose={() => setAboutModalOpen(false)}>
        <Stack
          spacing={2}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
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
            </Stack>
          </Box>
          <Box>
            <Typography variant="h5">Kontakt</Typography>
            <Link href="mailto:post@orcalabs.no">post@orcalabs.no</Link>
          </Box>
        </Stack>
      </Modal>
    </AppBar>
  );
};

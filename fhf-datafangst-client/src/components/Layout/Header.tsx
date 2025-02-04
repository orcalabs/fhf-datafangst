import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Button,
  Divider,
  Modal,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoIcon from "assets/logos/logoIcon";
import { AboutUs } from "components";
import { useAuth } from "oidc-react";
import { FC, useState } from "react";
import { Link as RouterLink } from "react-router";
import { MenuViewState, selectIsLoggedIn, useAppSelector } from "store";

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
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          height: 52,
        }}
      >
        <RouterLink
          style={{ maxHeight: 52, gridColumn: 2, textDecoration: "none" }}
          to={`/${MenuViewState.Live}`}
        >
          <Stack direction="row" alignItems="center">
            <LogoIcon height={40} />
            <Typography color="white" variant="h4">
              DataFangst
            </Typography>
          </Stack>
        </RouterLink>

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
        <>
          <AboutUs />
        </>
      </Modal>
    </AppBar>
  );
};

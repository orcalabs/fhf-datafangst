import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoIcon from "assets/logos/logoIcon";
import { AboutUs, HeaderMenuButtons } from "components";
import { AppPage } from "containers/App/App";
import { useAuth } from "oidc-react";
import { FC, useState } from "react";
import { Link, Link as RouterLink } from "react-router";
import { selectBwUserProfile, selectIsLoggedIn, useAppSelector } from "store";

export const HEADER_HEIGHT = 52;

export interface Props {
  page: AppPage;
}

export const Header: FC<Props> = ({ page }) => {
  const { signIn, signOutRedirect } = useAuth();
  const bwProfile = useAppSelector(selectBwUserProfile);
  const loggedIn = useAppSelector(selectIsLoggedIn);

  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar
      position="relative"
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
          height: HEADER_HEIGHT,
        }}
      >
        <HeaderMenuButtons page={page} />

        <RouterLink
          style={{
            maxHeight: HEADER_HEIGHT,
            gridColumn: 2,
            textDecoration: "none",
          }}
          to={`/${AppPage.Live}`}
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
          spacing={1}
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
            sx={{ bgcolor: "white", height: loggedIn ? 16 : 12 }}
          />
          {!loggedIn && (
            <Button
              sx={{
                justifySelf: "end",
                color: "white",
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={() => signIn()}
              endIcon={<AccountCircleIcon color="secondary" />}
            >
              Logg inn
            </Button>
          )}
          {loggedIn && (
            <Box sx={{ pl: 1.5, pr: 1.5 }}>
              <Avatar
                onClick={handleMenu}
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "secondary.main",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                {bwProfile?.user.firstName?.charAt(0)}
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                {bwProfile && (
                  <>
                    <Stack direction="row" gap={1.5} sx={{ p: 2, pt: 1 }}>
                      <Avatar>{bwProfile?.user.firstName?.charAt(0)}</Avatar>
                      <Stack direction="column">
                        <Typography>
                          {bwProfile?.user.firstName +
                            " " +
                            bwProfile?.user.lastName}
                        </Typography>
                        <Typography variant="subtitle2">
                          {bwProfile?.user.email}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Divider sx={{ bgcolor: "primary.main", mb: 1 }} />
                  </>
                )}

                <Link
                  style={{ color: "black", textDecoration: "none" }}
                  to={"https://www.barentswatch.no/minside/"}
                  target="_blank"
                >
                  <MenuItem onClick={() => setAnchorEl(null)}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Innstillinger
                  </MenuItem>
                </Link>

                <MenuItem onClick={() => signOutRedirect()}>
                  <ListItemIcon>
                    <LogoutSharpIcon fontSize="small" />
                  </ListItemIcon>
                  Logg ut
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Stack>
      </Toolbar>
      <AboutUs open={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
    </AppBar>
  );
};

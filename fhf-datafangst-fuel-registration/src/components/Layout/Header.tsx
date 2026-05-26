import "@khmyznikov/pwa-install";
import type { PWAInstallElement } from "@khmyznikov/pwa-install";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { FC } from "react";
import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/app/auth";
import theme from "~/app/theme";
import { VesselIcon } from "~/assets/icons";
import {
  ConsentDialog,
  LocalLoadingProgress,
  SelectedVessel,
  UserManual,
} from "~/components";
import {
  selectBwUserProfile,
  selectFisheryVessels,
  selectIsProjectUser,
  selectLoading,
  selectLoggedInVessel,
  selectUser,
  useAppSelector,
} from "~/store";

export const Header: FC = () => {
  const { signOutRedirect } = useAuth();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down(400));

  const loading = useAppSelector(selectLoading);
  const user = useAppSelector(selectUser);
  const isProjectUser = useAppSelector(selectIsProjectUser);
  const vessel = useAppSelector(selectLoggedInVessel);
  const fisheryVessels = useAppSelector(selectFisheryVessels);
  const bwProfile = useAppSelector(selectBwUserProfile);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userManualModalOpen, setUserManualModalOpen] = useState(false);
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [consentDialogAutoOpen, setConsentDialogAutoOpen] = useState(true);

  if (
    user &&
    (user.fuelConsent === undefined || user.fuelConsent === null) &&
    !consentDialogOpen &&
    consentDialogAutoOpen
  ) {
    setConsentDialogOpen(true);
    setConsentDialogAutoOpen(false);
  }

  const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

  let pwaInstallElement: PWAInstallElement | null = null;

  let deferredPrompt: Event | null = null;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  const handleShowDialog = () => {
    if (pwaInstallElement) {
      if (deferredPrompt) {
        pwaInstallElement.showDialog(true);
      } else {
        pwaInstallElement.showDialog(false);
      }
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          height: 60,
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          bgcolor: "primary.dark",
          color: "white",
          justifyContent: "center",
          "& .MuiToolbar-root": { pl: 0, pr: 1, justifyContent: "center" },
          zIndex: (theme) => theme.zIndex.drawer + 3,
        }}
      >
        <Toolbar
          variant="dense"
          disableGutters
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr auto" : "1fr auto 1fr",
            gridTemplateRows: "1fr",
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              gridColumnStart: isMobile ? 1 : 2,
              gridColumnEnd: 3,
            }}
          >
            <Stack
              spacing={2}
              direction="row"
              sx={{ pl: isMobile ? 2 : 0, alignItems: "center" }}
            >
              <VesselIcon
                height={isSmallMobile ? 28 : isMobile ? 30 : 44}
                width={isSmallMobile ? 28 : isMobile ? 30 : 44}
                fill="white"
              />

              {loading ? (
                <LocalLoadingProgress size={20} />
              ) : isMobile && (isProjectUser || fisheryVessels.length > 0) ? (
                <SelectedVessel />
              ) : (
                <Typography
                  sx={{ color: "white" }}
                  variant={isSmallMobile ? "h3" : isMobile ? "h5" : "h4"}
                >
                  {vessel?.fiskeridir.name ?? "Ukjent fartøy"}
                </Typography>
              )}
            </Stack>
          </Link>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              gridColumn: 3,
              alignItems: "center",
              justifySelf: "flex-end",
            }}
          >
            {!isMobile && (isProjectUser || fisheryVessels.length > 0) && (
              <>
                <SelectedVessel />
                <Divider
                  orientation="vertical"
                  sx={{ bgcolor: "white", height: 16 }}
                />
              </>
            )}
            <>
              <Box sx={{ pl: 1.5 }}>
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
              </Box>
              <Menu
                disableScrollLock
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
                {bwProfile && [
                  <Stack key={1} direction="row" sx={{ gap: 1.5, p: 2, pt: 1 }}>
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
                  </Stack>,
                  <Divider key={2} sx={{ bgcolor: "primary.main", mb: 1 }} />,
                ]}
                {!isInstalled && (
                  <MenuItem
                    onClick={() => {
                      handleShowDialog();
                      setAnchorEl(null);
                    }}
                  >
                    <ListItemIcon>
                      <AddToHomeScreenIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    Legg til på startskjerm
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    setUserManualModalOpen(true);
                    setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <InfoOutlinedIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  Brukerveiledning
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setConsentDialogOpen(true);
                    setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <PrivacyTipIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  Samtykkeerklæring
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => signOutRedirect()}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="warning" />
                  </ListItemIcon>
                  Logg ut
                </MenuItem>
              </Menu>
              {!isInstalled && (
                <pwa-install
                  ref={(el) => {
                    pwaInstallElement = el;
                  }}
                  disable-install-description="true"
                  manual-apple="true"
                  manual-chrome="true"
                />
              )}
            </>
          </Stack>
        </Toolbar>
        <UserManual
          open={userManualModalOpen}
          onClose={() => setUserManualModalOpen(false)}
        />
        <ConsentDialog
          open={consentDialogOpen}
          onClose={() => {
            setConsentDialogOpen(false);
          }}
        />
      </AppBar>
      <Toolbar />
    </>
  );
};

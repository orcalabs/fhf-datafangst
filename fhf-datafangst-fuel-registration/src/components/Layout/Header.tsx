import "@khmyznikov/pwa-install";
import { PWAInstallElement } from "@khmyznikov/pwa-install";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import {
  AppBar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "app/auth";
import theme from "app/theme";
import { VesselIcon } from "assets/icons";
import { ConsentDialog, UserManual } from "components";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  selectBwUserLoading,
  selectBwUserProfile,
  selectUser,
  useAppSelector,
} from "store";

export const Header: FC = () => {
  const { signOutRedirect } = useAuth();

  const toggleMenu = useMediaQuery(theme.breakpoints.down(900));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down(400));

  const user = useAppSelector(selectUser);
  const userData = useAppSelector(selectBwUserProfile);
  const bwUserLoading = useAppSelector(selectBwUserLoading);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userManualModalOpen, setUserManualModalOpen] = useState(false);
  const [consentDialogOpen, setConsentDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user && (user.fuelConsent === undefined || user.fuelConsent === null)) {
      setConsentDialogOpen(true);
    }
  }, [user]);

  const isInstalled = window.matchMedia("(display-mode: standalone)").matches;

  let pwaInstallElement: PWAInstallElement | null = null;

  let deferredPrompt: BeforeInstallPromptEvent | null = null;

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
              alignItems="center"
              sx={{ pl: isMobile ? 2 : 0 }}
            >
              <VesselIcon
                height={isSmallMobile ? 28 : isMobile ? "30" : "44"}
                width={isSmallMobile ? 28 : isMobile ? "30" : "44"}
                fill="white"
              />
              {!bwUserLoading && (
                <Typography
                  color="white"
                  variant={isSmallMobile ? "h3" : isMobile ? "h5" : "h4"}
                >
                  {userData?.fiskInfoProfile
                    ? (userData.fiskInfoProfile.vesselName ??
                      userData?.fiskInfoProfile?.ircs ??
                      "Ukjent fartøy")
                    : "Ukjent fartøy"}
                </Typography>
              )}
            </Stack>
          </Link>

          {toggleMenu ? (
            <>
              <IconButton onClick={handleMenu} sx={{ justifySelf: "flex-end" }}>
                <MenuIcon sx={{ color: "white" }} />
              </IconButton>
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
                {!isInstalled && (
                  <MenuItem
                    onClick={() => {
                      handleShowDialog();
                      setAnchorEl(null);
                    }}
                  >
                    <ListItemIcon>
                      <AddToHomeScreenIcon fontSize="small" color="secondary" />
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
                    <InfoOutlineIcon fontSize="small" color="secondary" />
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
                    <PrivacyTipIcon fontSize="small" color="secondary" />
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
          ) : (
            <Stack
              direction="row"
              justifySelf="flex-end"
              spacing={1}
              sx={{ gridColumn: 3 }}
              alignItems="center"
            >
              <IconButton
                sx={{ color: "secondary.light" }}
                onClick={() => setConsentDialogOpen(true)}
              >
                <PrivacyTipIcon />
              </IconButton>
              <IconButton
                sx={{ color: "secondary.light" }}
                onClick={() => setUserManualModalOpen(true)}
              >
                <InfoOutlineIcon />
              </IconButton>
              <Divider
                orientation="vertical"
                sx={{ bgcolor: "white", height: 16 }}
              />
              <Button
                sx={{
                  justifySelf: "end",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                onClick={() => signOutRedirect()}
                endIcon={<LogoutIcon sx={{ color: "secondary.light" }} />}
              >
                Logg ut
              </Button>
            </Stack>
          )}
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

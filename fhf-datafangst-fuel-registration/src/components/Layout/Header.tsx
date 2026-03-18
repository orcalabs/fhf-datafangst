import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
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
import theme from "app/theme";
import { VesselIcon } from "assets/icons";
import { UserManual } from "components";
import { useAuth } from "oidc-react";
import { FC, useState } from "react";
import { Link } from "react-router";
import {
  selectBwUserLoading,
  selectBwUserProfile,
  useAppSelector,
} from "store";

interface Props {
  onResetTabValue: () => void;
}

export const Header: FC<Props> = ({ onResetTabValue }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down(400));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userManualModalOpen, setUserManualModalOpen] = useState(false);
  const { signOutRedirect } = useAuth();
  const userData = useAppSelector(selectBwUserProfile);
  const bwUserLoading = useAppSelector(selectBwUserLoading);

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
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              gridColumnStart: isMobile ? 1 : 2,
              gridColumnEnd: 3,
            }}
            onClick={onResetTabValue}
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

          {isMobile ? (
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
                <MenuItem onClick={() => setUserManualModalOpen(true)}>
                  <ListItemIcon>
                    <InfoOutlineIcon fontSize="small" color="secondary" />
                  </ListItemIcon>
                  Brukerveiledning
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => signOutRedirect()}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="warning" />
                  </ListItemIcon>
                  Logg ut
                </MenuItem>
              </Menu>
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
      </AppBar>
    </>
  );
};

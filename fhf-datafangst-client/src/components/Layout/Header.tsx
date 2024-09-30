import { AppBar, Box, Link, Stack, Toolbar, Typography } from "@mui/material";
import LogoIcon from "assets/logos/logoIcon";
import { useAuth } from "oidc-react";
import { FC } from "react";
import { selectIsLoggedIn, useAppSelector } from "store";

export const Header: FC = () => {
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const { signIn, signOutRedirect } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        bgcolor: "primary.dark",
        zIndex: (theme) => theme.zIndex.drawer + 3,
        "& .MuiToolbar-root": { paddingLeft: 0, justifyContent: "center" },
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
        <Box
          sx={{ cursor: "pointer", gridColumn: 3, justifySelf: "end" }}
          onClick={() => {
            loggedIn ? signOutRedirect() : signIn();
          }}
        >
          {loggedIn ? "Logg ut" : "Logg inn"}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

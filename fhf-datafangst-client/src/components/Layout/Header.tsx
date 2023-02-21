import { AppBar, Link, Toolbar, Typography } from "@mui/material";
import { FC } from "react";

export const Header: FC = () => {
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
      <Toolbar variant="dense">
        <Link
          sx={{ maxHeight: 50 }}
          underline="none"
          href={window.location.origin}
        >
          <Typography color="white" variant="h4">
            DataFangst
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

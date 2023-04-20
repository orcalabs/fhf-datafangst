import { Box, Button, Divider, Drawer, Typography } from "@mui/material";
import { VesselInfo } from "components";
import { FC } from "react";
import { login, selectIsLoggedIn, useAppDispatch, useAppSelector } from "store";

export const MyPage: FC = () => {
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <Box sx={{ height: "100%" }}>
      <Drawer
        variant="permanent"
        sx={{
          height: "100%",
          "& .MuiDrawer-paper": {
            width: 500,
            position: "relative",
            boxSizing: "border-box",
            bgcolor: "primary.main",
            color: "white",
            flexShrink: 0,
            height: "100%",
          },
          "& .MuiOutlinedInput-root": { borderRadius: 0 },
          "& .MuiChip-filled": {
            color: "black",
            bgcolor: "secondary.main",
            borderRadius: 0,
          },
        }}
      >
        {!loggedIn && (
          <Typography variant="h6">
            Du må være innlogget for å se denne siden
            <Button
              onClick={() => {
                dispatch(login());
              }}
            >
              Logg inn
            </Button>
          </Typography>
        )}
        <VesselInfo />
        <Divider sx={{ bgcolor: "text.secondary", mt: 3, mb: 1, mx: 4 }} />
      </Drawer>
    </Box>
  );
};

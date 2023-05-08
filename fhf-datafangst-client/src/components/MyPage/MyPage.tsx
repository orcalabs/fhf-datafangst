import { Box, Button, Divider, Drawer, Typography } from "@mui/material";
import { Filters, VesselInfo } from "components";
import { Vessel } from "generated/openapi";
import { FC } from "react";
import { selectIsLoggedIn, useAppSelector } from "store";

interface Props {
  vessel?: Vessel;
}

export const MyPage: FC<Props> = (props) => {
  const { vessel } = props;
  const loggedIn = useAppSelector(selectIsLoggedIn);

  const content = () => {
    if (!loggedIn) {
      return (
        <>
          <Typography variant="h6">
            Du må være innlogget for å se denne siden
          </Typography>
          <Button
            sx={{
              borderRadius: 0,
              width: "110px",
              mt: 1,
              bgcolor: "secondary.main",
              color: "white",
              ":hover": {
                bgcolor: "secondary.light",
              },
            }}
          >
            Logg inn
          </Button>
        </>
      );
    } else {
      return (
        <>
          <VesselInfo vessel={vessel} />
          {vessel && (
            <>
              <Divider
                sx={{ bgcolor: "text.secondary", mt: 3, mb: 1, mx: 4 }}
              />
              <Filters selectedVessel={vessel} />
            </>
          )}
        </>
      );
    }
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Drawer
        variant="permanent"
        sx={{
          height: "100%",
          "& .MuiDrawer-paper": {
            p: 3,
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
        {content()}
      </Drawer>
    </Box>
  );
};

import { Box } from "@mui/material";
import { FC } from "react";

export const MapControls: FC = () => {
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Box
        id="map-coordinate"
        sx={{
          ".ol-mouse-position": {
            position: "relative",
            color: "black",
            fontSize: "0.8rem",
            letterSpacing: 0.3,
            fontWeight: 600,
            top: "unset",
            right: "unset",
            left: 8,
            bottom: 32,
          },
        }}
      />
      <Box
        id="scale-line"
        sx={{
          position: "relative",
          ".ol-scale-line": {
            borderRadius: 0,
            bgcolor: "rgba(0,60,136,.3)",
            bottom: 1,
          },
          ".ol-scale-line-inner": {
            borderColor: "#eee",
            color: "#eee",
          },
        }}
      />
    </Box>
  );
};

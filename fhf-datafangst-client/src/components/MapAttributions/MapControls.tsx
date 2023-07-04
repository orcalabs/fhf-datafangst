import { Box } from "@mui/material";
import { FC } from "react";

export const MapControls: FC = () => {
  return (
    <Box
      id="map-controls"
      sx={{
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        position: "relative",
      }}
    >
      <Box
        id="map-coordinate"
        sx={{
          ".ol-mouse-position": {
            position: "relative",
            color: "black",
            bottom: 40,
            fontSize: "0.8rem",
            letterSpacing: 0.3,
            fontWeight: 600,
            left: 8,
            top: "unset",
            right: "unset",
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

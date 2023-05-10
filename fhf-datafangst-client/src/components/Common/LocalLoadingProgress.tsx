import { Box, CircularProgress } from "@mui/material";
import { FC } from "react";

export const LocalLoadingProgress: FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <CircularProgress color="inherit" disableShrink />
    </Box>
  );
};

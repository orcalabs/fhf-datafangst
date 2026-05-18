import { Box, CircularProgress } from "@mui/material";
import type { FC } from "react";

interface Props {
  color?: string;
  size?: number | string;
}

export const LocalLoadingProgress: FC<Props> = ({ color, size }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        color: color ?? "white",
      }}
    >
      <CircularProgress color="inherit" size={size} disableShrink />
    </Box>
  );
};

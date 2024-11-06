import { Box, CircularProgress } from "@mui/material";
import { FC } from "react";

interface Props {
  color?: string;
}

export const LocalLoadingProgress: FC<Props> = ({ color }) => {
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
      <CircularProgress color="inherit" disableShrink />
    </Box>
  );
};

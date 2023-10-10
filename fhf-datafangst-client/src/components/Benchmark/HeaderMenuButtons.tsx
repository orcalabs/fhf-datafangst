import { ArrowBackIos } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import { FC } from "react";

export const HeaderMenuButtons: FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        position: "relative",
        zIndex: 10000,
        "& .MuiIconButton-root": {
          color: "white",
          px: 2,
          height: 49,
          border: 0,
          width: "50%",
          "&.Mui-selected": {
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.main" },
          },
          "&:hover": { bgcolor: "secondary.dark" },
        },
      }}
    >
      <IconButton onClick={() => history.back()}>
        <ArrowBackIos />
        Tilbake til Kart
      </IconButton>

    </Box>
  );
};

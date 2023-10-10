import { Box, Button } from "@mui/material";
import { FC } from "react";

export const HeaderMenuButtons: FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        position: "relative",
        zIndex: 10000,
        "& .MuiButton-root": {
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
      <Button onClick={() => history.back()}>
        Tilbake til Kart
      </Button>

    </Box>
  );
};

import { ArrowBackIos } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

export const HeaderMenuButtons: FC = () => {
  const navigate = useNavigate();

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
          borderRadius: 0,
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
      <IconButton onClick={() => navigate("/")}>
        <ArrowBackIos />
        Tilbake til Kart
      </IconButton>
    </Box>
  );
};

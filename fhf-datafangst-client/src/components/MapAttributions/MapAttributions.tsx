import { Box, Link } from "@mui/material";
import mapboxLogo from "assets/logos/mapbox-logo-white.svg";
import { FC } from "react";

export const MapAttributions: FC = () => {
  return (
    <Box
      sx={{
        bottom: 5,
        position: "relative",
        display: "flex",
        fontSize: "small",
        marginRight: "10px",
        zIndex: 10,
      }}
    >
      <Link
        href="http://mapbox.com/about/maps"
        target="_blank"
        sx={{
          marginRight: 1,
          height: "20px",
          width: "65px",
          textIndent: "-9999px",
          overflow: "hidden",
          backgroundImage: `url(${mapboxLogo})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 0",
          backgroundSize: "65px 20px",
        }}
      >
        Mapbox
      </Link>
      <Link sx={{ mr: "4px", pt: 0 }} href="https://www.mapbox.com/about/maps/">
        © Mapbox |{" "}
      </Link>
      <Link
        sx={{ mr: "4px", pt: 0 }}
        href="http://www.openstreetmap.org/copyright"
      >
        © OpenStreetMap |
      </Link>
      <> </>
      <Link
        sx={{ pt: 0 }}
        href="https://www.mapbox.com/map-feedback/"
        target="_blank"
      >
        Improve this map
      </Link>
    </Box>
  );
};

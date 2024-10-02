import { Box, useMediaQuery } from "@mui/material";
import theme from "app/theme";

export const GridContainer = (props: any) => {
  const breakPoint = useMediaQuery(theme.breakpoints.up("xl"));
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: !breakPoint
          ? "minmax(390px, 18vw) 1fr minmax(390px, 18vw)"
          : "minmax(390px, 16vw) 1fr minmax(390px, 16vw)",
        gridTemplateRows: "48px 56px 1fr 100px",
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      {props.children}
    </Box>
  );
};

export const HeaderTrack = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 4,
      gridRowStart: 1,
      gridRowEnd: 1,
    }}
  >
    {props.children}
  </Box>
);

export const HeaderButtonCell = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 1,
      gridRowEnd: 1,
    }}
  >
    {props.children}
  </Box>
);

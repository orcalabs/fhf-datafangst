import { Box, useMediaQuery } from "@mui/material";
import theme from "app/theme";

export const GridContainer = (props: any) => {
  const breakPoint = useMediaQuery(theme.breakpoints.up("xl"));
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: !breakPoint
          ? "minmax(400px, 18vw) 1fr minmax(400px, 18vw)"
          : "minmax(400px, 15vw) 1fr minmax(400px, 15vw)",
        gridTemplateRows: "52px 56px 1fr 100px",
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
      gridColumnEnd: 3,
      gridRowStart: 1,
      gridRowEnd: 1,
    }}
  >
    {props.children}
  </Box>
);

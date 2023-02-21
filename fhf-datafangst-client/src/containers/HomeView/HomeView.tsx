import { Box } from "@mui/material";
import { MapBoxLayer, Map, FilterMenu, Header } from "components";
import { FC } from "react";

const GridContainer = (props: any) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "clamp(300px, 20%, 400px) 1fr",
      gridTemplateRows: "49px 1fr",
      position: "absolute",
      width: "100%",
      height: "100%",
    }}
  >
    {props.children}
  </Box>
);

const HeaderTrack = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 3,
      gridRowStart: 1,
      gridRowEnd: 2,
    }}
  >
    {props.children}
  </Box>
);

const MenuArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 2,
      gridRowEnd: 3,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {props.children}
  </Box>
);

export const HomeView: FC = () => {
  return (
    <>
      <GridContainer>
        <HeaderTrack>
          <Header />
        </HeaderTrack>
        <MenuArea>
          <FilterMenu />
        </MenuArea>
      </GridContainer>
      <Map>
        <MapBoxLayer />
      </Map>
    </>
  );
};

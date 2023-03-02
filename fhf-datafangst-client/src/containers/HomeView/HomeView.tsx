import { Box } from "@mui/material";
import {
  MapBoxLayer,
  Map,
  FilterMenu,
  Header,
  MapFilters,
  ShorelineLayer,
  LocationsGrid,
  HaulsLayer,
  HaulsHeatmapLayer,
  ViewModeToggle,
} from "components";
import { FC, useState } from "react";
import { selectViewMode, useAppSelector, ViewMode } from "store";

export interface MapFilter {
  coastline: boolean;
  fishingLocations: boolean;
  [key: string]: boolean;
}

const initialMapFilter: MapFilter = {
  coastline: false,
  fishingLocations: false,
  hauls: false,
};

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
  const [mapFilter, setMapFilter] = useState<MapFilter>(initialMapFilter);
  const viewMode = useAppSelector(selectViewMode);

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
        {viewMode === ViewMode.Grid && <LocationsGrid />}
        {viewMode === ViewMode.Heatmap && <HaulsHeatmapLayer />}
        {viewMode === ViewMode.Hauls && <HaulsLayer />}
        {mapFilter.coastline && <ShorelineLayer />}
      </Map>
      <MapFilters mapFilter={mapFilter} onFilterChange={setMapFilter} />
      <ViewModeToggle />
    </>
  );
};

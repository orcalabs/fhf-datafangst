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
  LoadingScreen,
  HaulsMenu,
} from "components";
import { FC, useState } from "react";
import {
  selectHaulsLoading,
  selectHaulsMenuOpen,
  selectViewMode,
  useAppSelector,
  ViewMode,
} from "store";

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
      gridTemplateColumns:
        "clamp(300px, 20%, 400px) 1fr clamp(300px, 20%, 400px)",
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
      gridColumnEnd: 4,
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

const HaulMenuArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 3,
      gridColumnEnd: 4,
      gridRowStart: 2,
      gridRowEnd: 3,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {props.children}
  </Box>
);

const FilterButtonArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: props.haulsMenuOpen ? 2 : 2,
      gridColumnEnd: props.haulsMenuOpen ? 2 : 4,
      gridRowStart: 2,
      gridRowEnd: 3,
      display: "flex",
      justifyContent: "flex-end",
    }}
  >
    {props.children}
  </Box>
);

export const HomeView: FC = () => {
  const [mapFilter, setMapFilter] = useState<MapFilter>(initialMapFilter);
  const viewMode = useAppSelector(selectViewMode);
  const haulsLoading = useAppSelector(selectHaulsLoading);
  const haulsMenuOpen = useAppSelector(selectHaulsMenuOpen);

  return (
    <>
      <GridContainer>
        <HeaderTrack>
          <Header />
        </HeaderTrack>
        <MenuArea>
          <FilterMenu />
        </MenuArea>
        <FilterButtonArea haulsMenuOpen={haulsMenuOpen}>
          <MapFilters mapFilter={mapFilter} onFilterChange={setMapFilter} />
        </FilterButtonArea>
        <HaulMenuArea>
          <HaulsMenu />
        </HaulMenuArea>
      </GridContainer>
      <Map>
        <MapBoxLayer />
        {viewMode === ViewMode.Grid && <LocationsGrid />}
        {viewMode === ViewMode.Heatmap && <HaulsHeatmapLayer />}
        {mapFilter.coastline && <ShorelineLayer />}
        <HaulsLayer />
      </Map>
      <ViewModeToggle />
      <LoadingScreen open={haulsLoading} />
    </>
  );
};

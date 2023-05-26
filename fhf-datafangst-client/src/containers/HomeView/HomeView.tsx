import { Box, Snackbar } from "@mui/material";
import {
  MapBoxLayer,
  Map,
  Header,
  MapFilters,
  ShorelineLayer,
  LocationsGrid,
  HaulsLayer,
  HaulsHeatmapLayer,
  ViewModeToggle,
  LoadingScreen,
  HaulsMenu,
  TrackLayer,
  TripsMenu,
  HeaderMenuButtons,
  MainMenu,
  TripsLayer,
} from "components";
import { FishingFacilitiesLayer } from "components/Layers/FishingFacilitiesLayer";
import { FC, useEffect, useState } from "react";
import {
  resetState,
  selectTrackMissing,
  selectHaulsMenuOpen,
  selectHaulsMatrixSearch,
  selectSelectedGridsString,
  selectSelectedTrip,
  selectTrackLoading,
  selectViewMode,
  useAppDispatch,
  useAppSelector,
  ViewMode,
  setHaulsMatrix2Search,
  selectShowGrid,
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
      gridTemplateColumns: "500px 1fr 500px",
      gridTemplateRows: "48px 56px 1fr",
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

const HeaderButtonCell = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 2,
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
      gridRowEnd: 4,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
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
      gridRowEnd: 4,
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
      gridColumnStart: 2,
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
  const dispatch = useAppDispatch();
  const trackMissing = useAppSelector(selectTrackMissing);
  const viewMode = useAppSelector(selectViewMode);
  const haulsMenuOpen = useAppSelector(selectHaulsMenuOpen);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const trackLoading = useAppSelector(selectTrackLoading);
  const showGrid = useAppSelector(selectShowGrid);

  // Fetch hauls for selected grid
  useEffect(() => {
    if (selectedGrids.length) {
      dispatch(
        setHaulsMatrix2Search({
          years: haulsSearch?.years,
          months: haulsSearch?.months,
          vessels: haulsSearch?.vessels,
          catchLocations: selectedGrids,
        }),
      );
    } else {
      dispatch(resetState);
    }
  }, [dispatch, selectedGrids]);

  return (
    <>
      <GridContainer>
        <HeaderTrack>
          <Header />
        </HeaderTrack>
        <HeaderButtonCell>
          <HeaderMenuButtons />
        </HeaderButtonCell>
        <MenuArea>
          <MainMenu />
        </MenuArea>
        <FilterButtonArea haulsMenuOpen={haulsMenuOpen}>
          <MapFilters mapFilter={mapFilter} onFilterChange={setMapFilter} />
        </FilterButtonArea>
        <HaulMenuArea>
          {/* Use grid to set Trip menu on top when active, without removing HaulsMenu and its state */}
          <Box sx={{ display: "grid", height: "100%" }}>
            <Box sx={{ gridRow: 1, gridColumn: 1, overflowY: "auto" }}>
              <HaulsMenu />
            </Box>
            <Box sx={{ gridRow: 1, gridColumn: 1, overflowY: "auto" }}>
              {selectedTrip && <TripsMenu />}
            </Box>
          </Box>
        </HaulMenuArea>
      </GridContainer>
      <Map>
        <MapBoxLayer />
        {showGrid && <LocationsGrid />}
        {viewMode === ViewMode.Heatmap && <HaulsHeatmapLayer />}
        {mapFilter.coastline && <ShorelineLayer />}
        {viewMode !== ViewMode.Heatmap && <HaulsLayer />}
        {!selectedTrip && <TrackLayer />}
        {selectedTrip && <TripsLayer />}
        <FishingFacilitiesLayer />
      </Map>
      <ViewModeToggle />
      <LoadingScreen open={trackLoading} />
      <Box
        sx={{
          "& .MuiSnackbar-anchorOriginTopCenter": { top: 60 },
          "& .MuiSnackbar-anchorOriginBottomCenter": { bottom: 80 },
          "& .MuiSnackbarContent-root": {
            bgcolor: "#725840",
            borderRadius: 0,
          },
        }}
      >
        <Snackbar
          sx={{ "& .MuiPaper-root": { minWidth: 0 } }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={trackMissing}
          message={"Spor for dette halet er ikke tilgjengelig"}
        />
      </Box>
    </>
  );
};

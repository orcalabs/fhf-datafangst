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
  MapAttributions,
  TimeSlider,
  SeamapLayer,
  CurrentTripMenu,
} from "components";
import { FishingFacilitiesLayer } from "components/Layers/FishingFacilitiesLayer";
import { FC, useEffect, useState } from "react";
import {
  resetState,
  selectTrackMissing,
  selectSecondaryMenuOpen,
  selectHaulsMatrixSearch,
  selectSelectedGridsString,
  selectTrackLoading,
  selectViewMode,
  useAppDispatch,
  useAppSelector,
  ViewMode,
  setHaulsMatrix2Search,
  selectShowGrid,
  selectShowTimeSlider,
  selectCurrentTrip,
  selectSelectedTrip,
} from "store";

export interface MapFilter {
  coastline: boolean;
  seamap: boolean;
  [key: string]: boolean;
}

const initialMapFilter: MapFilter = {
  coastline: false,
  seamap: false,
};

const GridContainer = (props: any) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "500px 1fr 500px",
      gridTemplateRows: "48px 56px 1fr 100px",
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
      gridRowEnd: 5,
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
      gridRowEnd: 5,
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

const MapAttributionsArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.haulsMenuOpen ? 3 : 4,
      gridRowStart: 4,
      gridRowEnd: 5,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
    }}
  >
    {props.children}
  </Box>
);

const TimeSliderArea = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.haulsMenuOpen ? 2 : 4,
      gridRowStart: 4,
      gridRowEnd: 5,
      display: "flex",
      flexDirection: "column",
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
  const haulsMenuOpen = useAppSelector(selectSecondaryMenuOpen);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const selectedCurrentTrip = useAppSelector(selectCurrentTrip);
  const trackLoading = useAppSelector(selectTrackLoading);
  const showGrid = useAppSelector(selectShowGrid);
  const showTimeSlider = useAppSelector(selectShowTimeSlider);

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
              {selectedCurrentTrip && <CurrentTripMenu />}
            </Box>
          </Box>
        </HaulMenuArea>
        <TimeSliderArea haulsMenuOpen={haulsMenuOpen}>
          {showTimeSlider && <TimeSlider />}
        </TimeSliderArea>
        <MapAttributionsArea haulsMenuOpen={haulsMenuOpen}>
          <Box
            id="scale-line"
            sx={{
              ".ol-scale-line": {
                borderRadius: 0,
                bgcolor: "rgba(0,60,136,.3)",
                bottom: 10,
              },
              ".ol-scale-line-inner": {
                borderColor: "#eee",
                color: "#eee",
              },
              position: "relative",
              zIndex: 1000,
              left: 3,
            }}
          />
          <MapAttributions />
        </MapAttributionsArea>
      </GridContainer>
      <Map>
        <MapBoxLayer />
        {showGrid && <LocationsGrid />}
        {viewMode === ViewMode.Heatmap && <HaulsHeatmapLayer />}
        {mapFilter.coastline && <ShorelineLayer />}
        {mapFilter.seamap && <SeamapLayer />}
        {viewMode !== ViewMode.Heatmap && <HaulsLayer />}
        {!selectedTrip && <TrackLayer />}
        {(selectedTrip ?? selectedCurrentTrip) && <TripsLayer />}
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

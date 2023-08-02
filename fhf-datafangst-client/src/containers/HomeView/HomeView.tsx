import { Box, Snackbar } from "@mui/material";
import { HaulsFilter, LandingsFilter } from "api";
import {
  MapBoxLayer,
  Map,
  Header,
  MapFilters,
  ShorelineLayer,
  LocationsGrid,
  HaulsLayer,
  LoadingScreen,
  HaulsMenu,
  LandingsMenu,
  TrackLayer,
  TripsMenu,
  HeaderMenuButtons,
  MainMenu,
  TripsLayer,
  MapAttributions,
  TimeSlider,
  SeamapLayer,
  CurrentTripMenu,
  MapControls,
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
  useAppDispatch,
  useAppSelector,
  setHaulsMatrix2Search,
  selectShowGrid,
  selectShowHaulTimeSlider,
  selectCurrentTrip,
  selectSelectedTrip,
  setHaulDateSliderFrame,
  setHoveredHaulFilter,
  setHaulsMatrixSearch,
  selectLandingsMatrixSearch,
  selectShowLandingTimeSlider,
  setLandingDateSliderFrame,
  setHoveredLandingFilter,
  setLandingsMatrixSearch,
  setLandingsMatrix2Search,
  selectMatrixToggle,
  MatrixToggle,
} from "store";
import { MinErsYear, MinLandingYear } from "utils";

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

const FilterButtonArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 2 : 4,
      gridRowStart: 2,
      gridRowEnd: 3,
      display: "flex",
      justifyContent: "flex-end",
    }}
  >
    {props.children}
  </Box>
);

const MapAttributionsArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 3 : 4,
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

const TimeSliderArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 2 : 4,
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
  const secondaryMenuOpen = useAppSelector(selectSecondaryMenuOpen);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const landingsSearch = useAppSelector(selectLandingsMatrixSearch);
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const selectedCurrentTrip = useAppSelector(selectCurrentTrip);
  const trackLoading = useAppSelector(selectTrackLoading);
  const showGrid = useAppSelector(selectShowGrid);
  const showHaulTimeSlider = useAppSelector(selectShowHaulTimeSlider);
  const showLandingTimeSlider = useAppSelector(selectShowLandingTimeSlider);
  const matrixToggle = useAppSelector(selectMatrixToggle);

  // Fetch hauls for selected grid
  useEffect(() => {
    if (selectedGrids.length) {
      dispatch(
        matrixToggle === MatrixToggle.Haul
          ? setHaulsMatrix2Search({
              years: haulsSearch?.years,
              months: haulsSearch?.months,
              vessels: haulsSearch?.vessels,
              catchLocations: selectedGrids,
            })
          : setLandingsMatrix2Search({
              years: landingsSearch?.years,
              months: landingsSearch?.months,
              vessels: landingsSearch?.vessels,
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
        <FilterButtonArea open={secondaryMenuOpen}>
          <MapFilters mapFilter={mapFilter} onFilterChange={setMapFilter} />
        </FilterButtonArea>
        <HaulMenuArea>
          {/* Use grid to set Trip menu in front when active, without removing HaulsMenu and its state */}
          <Box sx={{ display: "grid", height: "100%" }}>
            <Box sx={{ gridRow: 1, gridColumn: 1, overflowY: "auto" }}>
              {matrixToggle === MatrixToggle.Haul ? (
                <HaulsMenu />
              ) : (
                <LandingsMenu />
              )}
            </Box>
            <Box sx={{ gridRow: 1, gridColumn: 1, overflowY: "auto" }}>
              {selectedTrip && <TripsMenu />}
              {selectedCurrentTrip && <CurrentTripMenu />}
            </Box>
          </Box>
        </HaulMenuArea>
        <TimeSliderArea open={secondaryMenuOpen}>
          {showHaulTimeSlider && (
            <TimeSlider
              options={haulsSearch}
              minYear={MinErsYear}
              onValueChange={(date: Date) =>
                dispatch(setHaulDateSliderFrame(date))
              }
              onOpenChange={(open: boolean) => {
                if (open) {
                  dispatch(setHoveredHaulFilter(HaulsFilter.Date));
                  dispatch(setHaulsMatrixSearch({ ...haulsSearch }));
                } else {
                  dispatch(setHaulDateSliderFrame(undefined));
                }
              }}
            />
          )}
        </TimeSliderArea>
        <TimeSliderArea open={secondaryMenuOpen}>
          {showLandingTimeSlider && (
            <TimeSlider
              options={landingsSearch}
              minYear={MinLandingYear}
              onValueChange={(date: Date) =>
                dispatch(setLandingDateSliderFrame(date))
              }
              onOpenChange={(open: boolean) => {
                if (open) {
                  dispatch(setHoveredLandingFilter(LandingsFilter.Date));
                  dispatch(setLandingsMatrixSearch({ ...landingsSearch }));
                } else {
                  dispatch(setLandingDateSliderFrame(undefined));
                }
              }}
            />
          )}
        </TimeSliderArea>
        <MapAttributionsArea open={secondaryMenuOpen}>
          <MapControls />
          <MapAttributions />
        </MapAttributionsArea>
      </GridContainer>
      <Map>
        <MapBoxLayer />
        {showGrid && <LocationsGrid />}
        {mapFilter.coastline && <ShorelineLayer />}
        {mapFilter.seamap && <SeamapLayer />}
        <HaulsLayer />
        {!selectedTrip && <TrackLayer />}
        {(selectedTrip ?? selectedCurrentTrip) && <TripsLayer />}
        <FishingFacilitiesLayer />
      </Map>
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

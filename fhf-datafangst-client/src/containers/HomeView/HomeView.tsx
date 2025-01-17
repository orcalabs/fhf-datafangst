import { Box, Snackbar } from "@mui/material";
import { HaulsFilter, LandingsFilter } from "api";
import {
  CurrentDeliveryPointsLayer,
  CurrentTripMenu,
  DeliveryPointsLayer,
  HaulsLayer,
  HaulsMenu,
  Header,
  HeaderMenuButtons,
  LandingsMenu,
  LoadingScreen,
  LocationsGrid,
  MainMenu,
  Map,
  MapAttributions,
  MapBoxLayer,
  MapControls,
  MapFilters,
  SeamapLayer,
  ShorelineLayer,
  TimeSlider,
  TrackLayer,
  TripDetails,
  TripsLayer,
  TripsMenu,
} from "components";
import { FishingFacilitiesLayer } from "components/Layers/FishingFacilitiesLayer";
import { LiveVesselsLayer } from "components/Layers/LiveVesselsLayer";
import { GridContainer, HeaderButtonCell, HeaderTrack } from "containers";
import { FC, useEffect, useState } from "react";
import {
  MatrixToggle,
  MenuViewState,
  resetState,
  selectCurrentTrip,
  selectHaulsMatrixSearch,
  selectLandingsMatrixSearch,
  selectMatrixToggle,
  selectSecondaryMenuOpen,
  selectSelectedGridsString,
  selectSelectedTrip,
  selectShowGrid,
  selectShowHaulTimeSlider,
  selectShowLandingTimeSlider,
  selectTrackLoading,
  selectTrackMissing,
  selectTripDetailsOpen,
  selectViewState,
  setHaulDateSliderFrame,
  setHaulsMatrix2Search,
  setHaulsMatrixSearch,
  setHoveredHaulFilter,
  setHoveredLandingFilter,
  setLandingDateSliderFrame,
  setLandingsMatrix2Search,
  setLandingsMatrixSearch,
  setViewState,
  useAppDispatch,
  useAppSelector,
} from "store";
import { MinErsYear, MinLandingYear } from "utils";

export interface MapFilter {
  coastline: boolean;
  seamap: boolean;
  deliveryPoints: boolean;
  [key: string]: boolean;
}

const initialMapFilter: MapFilter = {
  coastline: false,
  seamap: false,
  deliveryPoints: false,
};

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

const CenterArea = (props: { open: boolean; children: any }) => (
  <Box
    sx={{
      gridColumnStart: 2,
      gridColumnEnd: props.open ? 2 : 4,
      gridRowStart: 2,
      gridRowEnd: 5,
      display: "flex",
      justifyContent: "flex-end",
    }}
  >
    {props.children}
  </Box>
);

export interface Props {
  view: MenuViewState;
}

export const HomeView: FC<Props> = ({ view }) => {
  const [mapFilter, setMapFilter] = useState<MapFilter>(initialMapFilter);
  const dispatch = useAppDispatch();
  const viewState = useAppSelector(selectViewState);
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
  const tripDetailsOpen = useAppSelector(selectTripDetailsOpen);

  const showHaulsMenu = Boolean(selectedGrids.length);

  useEffect(() => {
    if (view !== viewState) {
      dispatch(setViewState(view));
    }
  }, [dispatch, view, viewState]);

  useEffect(
    () => () => {
      dispatch(setViewState(undefined));
    },
    [],
  );

  // Fetch hauls for selected grid
  useEffect(() => {
    if (selectedGrids.length) {
      dispatch(
        matrixToggle === MatrixToggle.Haul
          ? setHaulsMatrix2Search({
              years: haulsSearch?.years,
              months: haulsSearch?.months,
              vessels: haulsSearch?.vessels,
              gearGroupIds: haulsSearch?.gearGroupIds,
              speciesGroupIds: haulsSearch?.speciesGroupIds,
              vesselLengthGroups: haulsSearch?.vesselLengthGroups,
              catchLocations: selectedGrids,
            })
          : setLandingsMatrix2Search({
              years: landingsSearch?.years,
              months: landingsSearch?.months,
              vessels: landingsSearch?.vessels,
              gearGroupIds: landingsSearch?.gearGroupIds,
              speciesGroupIds: landingsSearch?.speciesGroupIds,
              vesselLengthGroups: landingsSearch?.vesselLengthGroups,
              catchLocations: selectedGrids,
            }),
      );
    } else {
      dispatch(resetState());
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
            {showHaulsMenu && (
              <Box sx={{ gridRow: 1, gridColumn: 1, overflowY: "auto" }}>
                {matrixToggle === MatrixToggle.Haul ? (
                  <HaulsMenu />
                ) : (
                  <LandingsMenu />
                )}
              </Box>
            )}
            <Box sx={{ gridRow: 1, gridColumn: 1, overflowY: "auto" }}>
              {selectedTrip && <TripsMenu />}
              {selectedCurrentTrip && <CurrentTripMenu />}
            </Box>
          </Box>
        </HaulMenuArea>
        <TimeSliderArea open={secondaryMenuOpen}>
          <TimeSlider
            disabled={!showHaulTimeSlider}
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
        </TimeSliderArea>
        <TimeSliderArea open={secondaryMenuOpen}>
          <TimeSlider
            disabled={!showLandingTimeSlider}
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
        </TimeSliderArea>
        <MapAttributionsArea open={secondaryMenuOpen}>
          <MapControls />
          <MapAttributions />
        </MapAttributionsArea>
        {tripDetailsOpen && (
          <CenterArea open={secondaryMenuOpen}>
            <TripDetails />
          </CenterArea>
        )}
      </GridContainer>
      <Map>
        <MapBoxLayer />
        {showGrid && <LocationsGrid />}
        {mapFilter.coastline && <ShorelineLayer />}
        {mapFilter.seamap && <SeamapLayer />}
        <HaulsLayer />
        {!selectedTrip && <TrackLayer />}
        {(selectedTrip ?? selectedCurrentTrip) && <TripsLayer />}
        {selectedTrip && <CurrentDeliveryPointsLayer />}
        <FishingFacilitiesLayer />
        {mapFilter.deliveryPoints && <DeliveryPointsLayer />}
        {viewState === MenuViewState.Live && !selectedTrip && (
          <LiveVesselsLayer />
        )}
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
          message={
            selectedTrip
              ? "Spor for denne turen er ikke tilgjengelig"
              : "Spor for dette halet er ikke tilgjengelig"
          }
        />
      </Box>
    </>
  );
};

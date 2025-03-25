import {
  CurrentTripMenu,
  LoadingScreen,
  SelectedLiveVesselMenu,
  SelectedTripMenu,
  TrackLayer,
  TripDetails,
  TripsLayer,
} from "components";
import { LiveVesselsLayer } from "components/Layers/LiveVesselsLayer";
import { PageLayoutCenter, PageLayoutLeft, PageLayoutRight } from "containers";
import { FC, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  getCurrentPositions,
  getCurrentTripTrack,
  selectCurrentPositionsLoading,
  selectCurrentPositionsMap,
  selectCurrentTrip,
  selectCurrentTripLoading,
  selectFishmap,
  selectSelectedLiveVessel,
  selectSelectedTrip,
  selectTrack,
  selectTripDetailsOpen,
  selectVesselsByCallsign,
  setSelectedLiveVessel,
  useAppDispatch,
  useAppSelector,
} from "store";
import { fromLonLat } from "utils";

let FIRST_LOAD = true;

export const LivePage: FC = () => {
  const dispatch = useAppDispatch();
  const currentTrip = useAppSelector(selectCurrentTrip);
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const tripDetailsOpen = useAppSelector(selectTripDetailsOpen);
  const currentTripLoading = useAppSelector(selectCurrentTripLoading);
  const selectedPosition = useAppSelector(selectSelectedLiveVessel);
  const track = useAppSelector(selectTrack);
  const loading = useAppSelector(selectCurrentPositionsLoading);
  const currentPositionsMap = useAppSelector(selectCurrentPositionsMap);
  const vessels = useAppSelector(selectVesselsByCallsign);

  const [params, setParams] = useSearchParams();
  const selectedVesselCallSign = params.get("callSign");
  const selectedVessel = selectedVesselCallSign
    ? vessels[selectedVesselCallSign]
    : undefined;
  const liveVessel = selectedVessel
    ? currentPositionsMap?.[selectedVessel.fiskeridir.id]
    : undefined;
  const map = useAppSelector(selectFishmap);

  if (!selectedVesselCallSign) {
    FIRST_LOAD = false;
  }

  useEffect(() => {
    if (liveVessel) {
      dispatch(setSelectedLiveVessel(liveVessel));
      // Set map center to selected vessel
      if (FIRST_LOAD) {
        map.getView().setCenter(fromLonLat(liveVessel.lon, liveVessel.lat));
        FIRST_LOAD = false;
      }
    } else if (selectedVesselCallSign && Object.entries(vessels).length) {
      params.delete("callSign");
      setParams(params);
    }
  }, [liveVessel?.vesselId, vessels, selectedVesselCallSign]);

  // Get all vessel positions on page load
  useEffect(() => {
    dispatch(getCurrentPositions({}));
  }, []);

  // Interval for fetching updated positions on all vessels + track of potentially selected vessel in Live map.
  useEffect(() => {
    const id = setInterval(() => {
      dispatch(getCurrentPositions({}));
      if (selectedPosition && !selectedTrip) {
        dispatch(
          getCurrentTripTrack({
            vesselId: selectedPosition.vesselId,
            loading: false,
          }),
        );
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [selectedPosition, selectedTrip, currentTrip]);

  // Get track of vessels with no reported CurrentTrip.
  useEffect(() => {
    if (
      !currentTrip &&
      !currentTripLoading &&
      !selectedTrip &&
      selectedPosition
    ) {
      dispatch(
        getCurrentTripTrack({
          vesselId: selectedPosition.vesselId,
          loading: true,
        }),
      );
    }
  }, [currentTrip, selectedPosition, currentTripLoading, selectedTrip]);

  return (
    <>
      <PageLayoutLeft open={!!selectedPosition}>
        <SelectedLiveVesselMenu />
      </PageLayoutLeft>
      <PageLayoutCenter open={tripDetailsOpen} sx={{ zIndex: 1000 }}>
        <TripDetails />
      </PageLayoutCenter>
      <PageLayoutRight open={!!currentTrip || !!selectedTrip}>
        {selectedTrip ? <SelectedTripMenu /> : <CurrentTripMenu />}
        <TripsLayer />
      </PageLayoutRight>
      {loading ? <LoadingScreen open /> : !selectedTrip && <LiveVesselsLayer />}
      {track && !currentTrip && !selectedTrip && <TrackLayer />}
    </>
  );
};

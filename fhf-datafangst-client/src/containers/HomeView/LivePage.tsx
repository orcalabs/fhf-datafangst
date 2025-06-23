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
import { useQueryParams } from "hooks";
import { FC, useEffect } from "react";
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
  const [params, setParams] = useQueryParams();

  const currentTrip = useAppSelector(selectCurrentTrip);
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const tripDetailsOpen = useAppSelector(selectTripDetailsOpen);
  const currentTripLoading = useAppSelector(selectCurrentTripLoading);
  const selectedPosition = useAppSelector(selectSelectedLiveVessel);
  const track = useAppSelector(selectTrack);
  const loading = useAppSelector(selectCurrentPositionsLoading);
  const currentPositionsMap = useAppSelector(selectCurrentPositionsMap);
  const vessels = useAppSelector(selectVesselsByCallsign);
  const map = useAppSelector(selectFishmap);

  const selectedVesselCallSign = params.callSign;

  const selectedVessel = selectedVesselCallSign
    ? vessels[selectedVesselCallSign]
    : undefined;
  const liveVessel = selectedVessel
    ? currentPositionsMap?.[selectedVessel.fiskeridir.id]
    : undefined;

  if (!selectedVesselCallSign) {
    FIRST_LOAD = false;
  }

  useEffect(() => {
    if (params.callSign && liveVessel) {
      if (liveVessel.vesselId === selectedPosition?.vesselId) {
        return;
      }
      dispatch(setSelectedLiveVessel(liveVessel));
      if (FIRST_LOAD) {
        map.getView().setCenter(fromLonLat(liveVessel.lon, liveVessel.lat));
        FIRST_LOAD = false;
      }
    } else if (
      selectedVesselCallSign &&
      Object.entries(vessels).length &&
      Object.entries(currentPositionsMap).length
    ) {
      setParams({});
    }
  }, [
    liveVessel?.vesselId,
    vessels,
    currentPositionsMap,
    selectedVesselCallSign,
  ]);

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
  }, [selectedPosition?.vesselId, selectedTrip, currentTrip]);

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
  }, [
    currentTrip,
    selectedPosition?.vesselId,
    currentTripLoading,
    selectedTrip,
  ]);

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

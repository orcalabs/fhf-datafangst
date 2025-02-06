import {
  CurrentTripMenu,
  LoadingScreen,
  SelectedLiveVesselMenu,
  SelectedTripMenu,
  TripsLayer,
} from "components";
import { LiveVesselsLayer } from "components/Layers/LiveVesselsLayer";
import { PageLayoutLeft, PageLayoutRight } from "containers";
import { FC, useEffect } from "react";
import {
  getCurrentPositions,
  getCurrentTripTrack,
  selectCurrentPositionsLoading,
  selectCurrentTrip,
  selectCurrentTripLoading,
  selectSelectedLiveVessel,
  selectSelectedTrip,
  useAppDispatch,
  useAppSelector,
} from "store";

export const LivePage: FC = () => {
  const dispatch = useAppDispatch();

  const currentTrip = useAppSelector(selectCurrentTrip);
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const currentTripLoading = useAppSelector(selectCurrentTripLoading);
  const selectedPosition = useAppSelector(selectSelectedLiveVessel);
  const loading = useAppSelector(selectCurrentPositionsLoading);

  // Get all vessel positions on page load
  useEffect(() => {
    dispatch(getCurrentPositions({}));
  }, []);

  // Interval for fetching updated positions on all vessels + track of potentially selected vessel in Live map.
  useEffect(() => {
    const id = setInterval(() => {
      dispatch(getCurrentPositions({}));
      if (selectedPosition) {
        dispatch(
          getCurrentTripTrack({
            vesselId: selectedPosition.vesselId,
            loading: false,
          }),
        );
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [selectedPosition, currentTrip]);

  // Get track of vessels with no reported CurrentTrip.
  useEffect(() => {
    if (!currentTrip && !currentTripLoading && selectedPosition) {
      dispatch(
        getCurrentTripTrack({
          vesselId: selectedPosition.vesselId,
          loading: true,
        }),
      );
    }
  }, [currentTrip, selectedPosition, currentTripLoading]);

  return (
    <>
      <PageLayoutLeft open={!!selectedPosition}>
        <SelectedLiveVesselMenu />
      </PageLayoutLeft>
      <PageLayoutRight open={!!currentTrip || !!selectedTrip}>
        {selectedTrip ? <SelectedTripMenu /> : <CurrentTripMenu />}
        <TripsLayer />
      </PageLayoutRight>
      {loading ? <LoadingScreen open /> : <LiveVesselsLayer />}
    </>
  );
};

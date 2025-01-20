import { LoadingScreen, VectorLayer } from "components";
import { Feature } from "ol";
import Geometry from "ol/geom/Geometry";
import VectorSource from "ol/source/Vector";
import { FC, useEffect, useState } from "react";
import {
  getCurrentAis,
  getTrack,
  getTrackWithoutLoading,
  selectCurrentPositions,
  selectCurrentPositionsLoading,
  selectCurrentTrip,
  selectCurrentTripLoading,
  selectFishmapState,
  selectSelectedLiveVessel,
  selectVesselsByMmsi,
  useAppDispatch,
  useAppSelector,
} from "store";
import { changeIconSizeFromFeature, generateLiveVesselsVector } from "utils";

const ZOOM_FACTOR = 0.018;

export const LiveVesselsLayer: FC = () => {
  const dispatch = useAppDispatch();

  const state = useAppSelector(selectFishmapState);
  const positions = useAppSelector(selectCurrentPositions);
  const loading = useAppSelector(selectCurrentPositionsLoading);
  const selectedPosition = useAppSelector(selectSelectedLiveVessel);
  const currentTrip = useAppSelector(selectCurrentTrip);
  const vessels = useAppSelector(selectVesselsByMmsi);
  const currentTripLoading = useAppSelector(selectCurrentTripLoading);

  const [vector, setVector] = useState<VectorSource<Feature<Geometry>>>();
  const [iconSize, setIconSize] = useState<number | undefined>(
    (state.map.getView().getZoom() ?? 1) * ZOOM_FACTOR,
  );

  // Get all vessel positions on page load
  useEffect(() => {
    dispatch(getCurrentAis({}));
  }, []);

  // Interval for fetching updated positions on all vessels + track of potentially selected vessel in Live map.
  useEffect(() => {
    const id = setInterval(() => {
      dispatch(getCurrentAis({}));
      if (selectedPosition) {
        const vessel = vessels?.[selectedPosition.mmsi];
        dispatch(
          getTrackWithoutLoading({
            mmsi: selectedPosition.mmsi,
            callSign: vessel?.fiskeridir.callSign,
            start: currentTrip ? currentTrip.departure : undefined,
            end: currentTrip ? new Date().toISOString() : undefined,
          }),
        );
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [selectedPosition, currentTrip]);

  // Get track of vessels with no reported CurrentTrip.
  useEffect(() => {
    if (!currentTrip && !currentTripLoading && selectedPosition) {
      const vessel = vessels?.[selectedPosition.mmsi];
      dispatch(
        getTrack({
          mmsi: selectedPosition.mmsi,
          callSign: vessel?.fiskeridir.callSign,
        }),
      );
    }
  }, [currentTrip, selectedPosition, currentTripLoading]);

  // Store map zoom level in state
  useEffect(() => {
    const fn = () => {
      const zoom = state.map.getView().getZoom();
      if (zoom) {
        setIconSize(zoom * ZOOM_FACTOR);
      }
    };
    state.map.on("moveend", fn);
    return () => state.map.un("moveend", fn);
  }, [state.map, state.zoom]);

  // Change icon size from zoom level and if selected
  useEffect(() => {
    if (iconSize) {
      vector?.forEachFeature((f) =>
        changeIconSizeFromFeature(
          f,
          f.get("livePosition")?.mmsi === selectedPosition?.mmsi
            ? iconSize * 2
            : iconSize,
        ),
      );
    }
  }, [iconSize, selectedPosition]);

  useEffect(() => {
    setVector(generateLiveVesselsVector(positions, iconSize, selectedPosition));
  }, [positions]);

  return loading ? (
    <LoadingScreen open={true} />
  ) : (
    <VectorLayer source={vector} zIndex={7} />
  );
};

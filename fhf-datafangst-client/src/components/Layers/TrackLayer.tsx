import { FC, useEffect, useState } from "react";
import { VectorLayer } from "components";
import { generateVesselTrackVector, TravelVector } from "utils";
import {
  selectFishmapState,
  selectSelectedHaul,
  selectSelectedTrip,
  selectTrack,
  useAppSelector,
} from "store";

export const TrackLayer: FC = () => {
  const track = useAppSelector(selectTrack);
  const state = useAppSelector(selectFishmapState);
  const haul = useAppSelector(selectSelectedHaul);
  const trip = useAppSelector(selectSelectedTrip);

  const [zoom, setZoom] = useState<number | undefined>(
    state.map.getView().getZoom(),
  );
  const [trackVectors, setTrackVectors] = useState<TravelVector[]>();
  // Store map zoom level in state
  useEffect(() => {
    state.map.on("moveend", function () {
      const zoom = state.map.getView().getZoom();
      if (zoom) {
        setZoom(zoom);
      }
    });
  }, [state.map]);

  useEffect(() => {
    const vec = trip
      ? generateVesselTrackVector(track, zoom, undefined)
      : generateVesselTrackVector(track, zoom, haul);
    setTrackVectors(vec);
  }, [track, zoom]);

  return (
    <>
      {trackVectors?.map((v, i) => (
        <VectorLayer key={i} source={v.vector} zIndex={6} style={v.style} />
      ))}
    </>
  );
};

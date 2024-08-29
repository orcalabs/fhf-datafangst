import { VectorLayer } from "components";
import { FC, useEffect, useState } from "react";
import {
  selectFishmapState,
  selectSelectedHaul,
  selectTrack,
  useAppSelector,
} from "store";
import { generateVesselTrackVector, TravelVector } from "utils";

export const TrackLayer: FC = () => {
  const track = useAppSelector(selectTrack);
  const state = useAppSelector(selectFishmapState);
  const haul = useAppSelector(selectSelectedHaul);
  const [trackVectors, setTrackVectors] = useState<TravelVector[]>();
  const [zoom, setZoom] = useState<number | undefined>(
    state.map.getView().getZoom(),
  );

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
    const vec = generateVesselTrackVector(track, zoom, haul);
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

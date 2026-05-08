import type { FC } from "react";
import { useEffect, useState } from "react";
import { VectorLayer } from "~/components";
import { useFishmapContext } from "~/hooks";
import { selectSelectedHaul, selectTrack, useAppSelector } from "~/store";
import type { TravelVector } from "~/utils";
import { generateVesselTrackVector } from "~/utils";

export const TrackLayer: FC = () => {
  const { map } = useFishmapContext();

  const track = useAppSelector(selectTrack);
  const haul = useAppSelector(selectSelectedHaul);

  const [trackVectors, setTrackVectors] = useState<TravelVector[]>();
  const [zoom, setZoom] = useState<number | undefined>(map.getView().getZoom());

  // Store map zoom level in state
  useEffect(() => {
    const onMoveEnd = function () {
      const zoom = map.getView().getZoom();
      if (zoom) {
        setZoom(zoom);
      }
    };
    map.on("moveend", onMoveEnd);
    return () => map.un("moveend", onMoveEnd);
  }, [map]);

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

import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { VectorLayer } from "~/components";
import { useFishmapContext } from "~/hooks";
import { selectSelectedHaul, selectTrack, useAppSelector } from "~/store";
import { generateVesselTrackVector } from "~/utils";

export const TrackLayer: FC = () => {
  const { map } = useFishmapContext();

  const track = useAppSelector(selectTrack);
  const haul = useAppSelector(selectSelectedHaul);

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

  const trackVectors = useMemo(
    () => (track ? generateVesselTrackVector(track, zoom, haul) : undefined),
    [track, zoom, haul],
  );

  return (
    <>
      {trackVectors?.map((v, i) => (
        <VectorLayer key={i} source={v.vector} zIndex={6} style={v.style} />
      ))}
    </>
  );
};

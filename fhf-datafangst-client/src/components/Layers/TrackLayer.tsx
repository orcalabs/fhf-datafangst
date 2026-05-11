import type { FC } from "react";
import { useMemo } from "react";
import { VectorLayer } from "~/components";
import { useFishmapContext } from "~/hooks";
import { selectSelectedHaul, selectTrack, useAppSelector } from "~/store";
import { generateVesselTrackVector } from "~/utils";

export const TrackLayer: FC = () => {
  const { zoom } = useFishmapContext();

  const track = useAppSelector(selectTrack);
  const haul = useAppSelector(selectSelectedHaul);

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

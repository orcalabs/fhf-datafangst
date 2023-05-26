import { FC, useEffect, useState } from "react";
import { VectorLayer } from "components";
import {
  generateTripHaulsVector,
  generateVesselTrackVector,
  TravelVector,
} from "utils";
import {
  selectFishmapState,
  selectSelectedTrip,
  selectTrack,
  useAppSelector,
} from "store";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";

export const TripsLayer: FC = () => {
  const track = useAppSelector(selectTrack);
  const state = useAppSelector(selectFishmapState);
  const trip = useAppSelector(selectSelectedTrip);

  const [zoom, setZoom] = useState<number | undefined>(
    state.map.getView().getZoom(),
  );
  const [trackVectors, setTrackVectors] = useState<TravelVector[]>();
  const [haulsVector, setHaulsVector] = useState<VectorSource<Point>>();

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
    if (trip) {
      const vec = generateVesselTrackVector(track, zoom, undefined, true);
      const haulsVec = generateTripHaulsVector(trip, zoom);

      setTrackVectors(vec);
      setHaulsVector(haulsVec);
    }
  }, [track, zoom, trip]);

  return (
    <>
      {trackVectors?.map((v, i) => (
        <VectorLayer key={i} source={v.vector} zIndex={6} style={v.style} />
      ))}
      <VectorLayer source={haulsVector} zIndex={7} />
    </>
  );
};

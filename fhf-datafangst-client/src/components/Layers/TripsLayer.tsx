import { FC, useEffect, useState } from "react";
import { VectorLayer } from "components";
import {
  generateTripHaulsVector,
  generateVesselTrackVector,
  trackForHaul,
  TravelVector,
} from "utils";
import {
  selectFishmapState,
  selectSelectedTrip,
  selectSelectedTripHaul,
  selectTrack,
  useAppSelector,
} from "store";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";

export const TripsLayer: FC = () => {
  const track = useAppSelector(selectTrack);
  const state = useAppSelector(selectFishmapState);
  const trip = useAppSelector(selectSelectedTrip);
  const selectedTripHaul = useAppSelector(selectSelectedTripHaul);

  const [zoom, setZoom] = useState<number | undefined>(
    state.map.getView().getZoom(),
  );
  const [trackVectors, setTrackVectors] = useState<TravelVector[]>();
  const [haulsVector, setHaulsVector] = useState<VectorSource<Point>>();
  const [selectedHaulTrackVector, setSelectedHaulTrackVector] =
    useState<TravelVector[]>();

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
      const haulsVec = generateTripHaulsVector(trip, zoom, selectedTripHaul);

      setTrackVectors(vec);
      setHaulsVector(haulsVec);
    }
  }, [track, zoom, trip, selectedTripHaul]);

  // Create a new track for a selected haul, to draw on top of original Trip track
  useEffect(() => {
    const selectedHaulTrack = trackForHaul(track, selectedTripHaul);
    const vec = generateVesselTrackVector(
      selectedHaulTrack,
      zoom,
      selectedTripHaul,
      false,
      true,
    );
    setSelectedHaulTrackVector(vec);
  }, [selectedTripHaul, track]);

  return (
    <>
      {trackVectors?.map((v, i) => (
        <VectorLayer key={i} source={v.vector} zIndex={6} style={v.style} />
      ))}
      {selectedHaulTrackVector?.map((v, i) => (
        <VectorLayer key={i} source={v.vector} zIndex={7} style={v.style} />
      ))}
      <VectorLayer source={haulsVector} zIndex={8} />
    </>
  );
};

import { FC, useEffect, useState } from "react";
import { VectorLayer } from "components";
import {
  generateFishingFacilitiesVector,
  generateTripHaulsVector,
  generateVesselTrackVector,
  trackForHaul,
  TravelVector,
} from "utils";
import {
  selectFishmapState,
  selectSelectedOrCurrentTrip,
  selectSelectedTripHaul,
  selectTrack,
  useAppSelector,
} from "store";
import VectorSource from "ol/source/Vector";
import { Geometry, Point } from "ol/geom";
import { Feature } from "ol";

export const TripsLayer: FC = () => {
  const track = useAppSelector(selectTrack);
  const state = useAppSelector(selectFishmapState);
  const trip = useAppSelector(selectSelectedOrCurrentTrip);
  const selectedTripHaul = useAppSelector(selectSelectedTripHaul);
  const [zoom, setZoom] = useState<number | undefined>(
    state.map.getView().getZoom(),
  );
  const [trackVectors, setTrackVectors] = useState<TravelVector[]>();
  const [haulsVector, setHaulsVector] =
    useState<VectorSource<Feature<Point>>>();
  const [selectedHaulTrackVector, setSelectedHaulTrackVector] =
    useState<TravelVector[]>();
  const [fishingFacilityVector, setFishingFacilityVector] =
    useState<VectorSource<Feature<Geometry>>>();

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
      const haulsVec = generateTripHaulsVector(
        trip.hauls,
        zoom,
        selectedTripHaul,
      );
      const fishingFacilityVec = generateFishingFacilitiesVector(
        trip.fishingFacilities,
      );

      setTrackVectors(vec);
      setHaulsVector(haulsVec);
      setFishingFacilityVector(fishingFacilityVec);
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
  }, [selectedTripHaul, track, zoom]);

  return (
    <>
      {trackVectors?.map((v, i) => (
        <VectorLayer key={i} source={v.vector} zIndex={6} style={v.style} />
      ))}
      {selectedHaulTrackVector?.map((v, i) => (
        <VectorLayer key={i} source={v.vector} zIndex={7} style={v.style} />
      ))}
      <VectorLayer source={haulsVector} zIndex={8} name="tripHaulsLayer" />
      <VectorLayer
        source={fishingFacilityVector}
        zIndex={5}
        name="gearsLayer"
      />
    </>
  );
};

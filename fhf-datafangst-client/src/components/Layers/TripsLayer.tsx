import type { Feature } from "ol";
import type { Geometry, Point } from "ol/geom";
import type VectorSource from "ol/source/Vector";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { VectorLayer } from "~/components";
import { AppPage } from "~/containers/App/App";
import { useFishmapContext } from "~/hooks";
import {
  selectAppPage,
  selectSelectedOrCurrentTrip,
  selectSelectedTripHaul,
  selectTrack,
  useAppSelector,
} from "~/store";
import type { TravelVector } from "~/utils";
import {
  generateCatchTransferVector,
  generateFishingFacilitiesVector,
  generateTripHaulsVector,
  generateVesselTrackVector,
  trackForHaul,
} from "~/utils";

export const TripsLayer: FC = () => {
  const { map, focusTrack } = useFishmapContext();

  const appPage = useAppSelector(selectAppPage);
  const track = useAppSelector(selectTrack);
  const trip = useAppSelector(selectSelectedOrCurrentTrip);
  const selectedTripHaul = useAppSelector(selectSelectedTripHaul);

  const [zoom, setZoom] = useState<number | undefined>(map.getView().getZoom());
  const [trackVectors, setTrackVectors] = useState<TravelVector[]>();
  const [haulsVector, setHaulsVector] =
    useState<VectorSource<Feature<Point>>>();
  const [selectedHaulTrackVector, setSelectedHaulTrackVector] =
    useState<TravelVector[]>();
  const [fishingFacilityVector, setFishingFacilityVector] =
    useState<VectorSource<Feature<Geometry>>>();
  const [catchTransferVector, setCatchTransferVector] =
    useState<VectorSource<Feature<Geometry>>>();

  useEffect(() => {
    if (track && trip && ("tripId" in trip || appPage === AppPage.MyPage)) {
      focusTrack(track);
    }
  }, [track]);

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

      if ("tra" in trip) {
        const catchTransferVec = generateCatchTransferVector(
          trip.tra,
          track,
          zoom,
        );

        setCatchTransferVector(catchTransferVec);
      }

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
      <VectorLayer source={catchTransferVector} zIndex={8} />
    </>
  );
};

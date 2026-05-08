import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { VectorLayer } from "~/components";
import { useFishmapContext } from "~/hooks";
import { AppPage } from "~/models";
import {
  selectAppPage,
  selectSelectedOrCurrentTrip,
  selectSelectedTripHaul,
  selectTrack,
  useAppSelector,
} from "~/store";
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

  const trackVectors = useMemo(
    () =>
      track
        ? generateVesselTrackVector(track, zoom, undefined, true)
        : undefined,
    [track, zoom],
  );

  const haulsVector = useMemo(
    () =>
      trip
        ? generateTripHaulsVector(trip.hauls, zoom, selectedTripHaul)
        : undefined,
    [trip?.hauls, zoom, selectedTripHaul],
  );

  const fishingFacilityVector = useMemo(
    () =>
      trip
        ? generateFishingFacilitiesVector(trip.fishingFacilities)
        : undefined,
    [trip?.fishingFacilities],
  );

  const catchTransferVector = useMemo(
    () =>
      trip && "tra" in trip
        ? generateCatchTransferVector(trip.tra, track, zoom)
        : undefined,
    [trip, track, zoom],
  );

  const selectedHaulTrackVector = useMemo(
    () =>
      track
        ? generateVesselTrackVector(
            trackForHaul(track, selectedTripHaul),
            zoom,
            selectedTripHaul,
            false,
            true,
          )
        : undefined,
    [track, zoom, selectedTripHaul],
  );

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

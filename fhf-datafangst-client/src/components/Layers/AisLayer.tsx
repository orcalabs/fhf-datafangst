import { FC, useEffect, useState } from "react";
import { VectorLayer } from "components";
import { generateVesselTrackVector, TravelVector } from "utils";
import {
  selectAis,
  selectFishmapState,
  selectSelectedHaul,
  selectSelectedHaulTrip,
  useAppSelector,
} from "store";

export const AisLayer: FC = () => {
  const ais = useAppSelector(selectAis);
  const state = useAppSelector(selectFishmapState);
  const haul = useAppSelector(selectSelectedHaul);
  const trip = useAppSelector(selectSelectedHaulTrip);

  const [zoom, setZoom] = useState<number | undefined>(
    state.map.getView().getZoom(),
  );
  const [aisVectors, setAisVectors] = useState<TravelVector[]>();

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
      ? generateVesselTrackVector(ais, zoom, undefined)
      : generateVesselTrackVector(ais, zoom, haul);
    setAisVectors(vec);
  }, [ais, zoom]);

  return (
    <>
      {aisVectors?.map((v, i) => (
        <VectorLayer key={i} source={v.vector} zIndex={6} style={v.style} />
      ))}
    </>
  );
};

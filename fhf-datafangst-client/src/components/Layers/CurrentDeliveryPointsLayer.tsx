import { FC, useEffect, useState } from "react";
import Geometry from "ol/geom/Geometry";
import VectorSource from "ol/source/Vector";
import { VectorLayer } from "components";
import { deliveryPointStyle, generateDeliveryPointsVector } from "utils";
import {
  selectFishmapState,
  selectMapDeliveryPoints,
  useAppSelector,
} from "store";
import { Feature } from "ol";

export const CurrentDeliveryPointsLayer: FC = () => {
  const deliveryPoints = useAppSelector(selectMapDeliveryPoints);
  const state = useAppSelector(selectFishmapState);
  const [vector, setVector] = useState<VectorSource<Feature<Geometry>>>();
  const [zoom, setZoom] = useState<number | undefined>(
    state.map.getView().getZoom(),
  );

  const iconSize = zoom ? zoom * 0.12 : state.zoom * 0.12;

  // Store map zoom level in state
  useEffect(() => {
    state.map.on("moveend", function () {
      const zoom = state.map.getView().getZoom();
      if (zoom) {
        setZoom(zoom);
      }
    });
  }, [state.map]);

  // Change icon size from zoom level and if selected
  useEffect(() => {
    if (zoom) {
      vector?.forEachFeature((f) => {
        f.setStyle(deliveryPointStyle(iconSize));
      });
    }
  }, [zoom, iconSize, vector]);

  useEffect(
    () => setVector(generateDeliveryPointsVector(deliveryPoints)),
    [deliveryPoints],
  );

  return <VectorLayer source={vector} zIndex={4} />;
};

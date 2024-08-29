import { VectorLayer } from "components";
import { Feature } from "ol";
import Geometry from "ol/geom/Geometry";
import VectorSource from "ol/source/Vector";
import { FC, useEffect, useState } from "react";
import {
  selectDeliveryPoints,
  selectFishmapState,
  useAppSelector,
} from "store";
import { deliveryPointStyle, generateDeliveryPointsVector } from "utils";

export const DeliveryPointsLayer: FC = () => {
  const deliveryPoints = useAppSelector(selectDeliveryPoints);
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

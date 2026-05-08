import type { Feature } from "ol";
import type Geometry from "ol/geom/Geometry";
import type VectorSource from "ol/source/Vector";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { VectorLayer } from "~/components";
import { useFishmapContext } from "~/hooks";
import { selectDeliveryPoints, useAppSelector } from "~/store";
import { deliveryPointStyle, generateDeliveryPointsVector } from "~/utils";

export const DeliveryPointsLayer: FC = () => {
  const { map } = useFishmapContext();

  const deliveryPoints = useAppSelector(selectDeliveryPoints);

  const [vector, setVector] = useState<VectorSource<Feature<Geometry>>>();
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

  // Change icon size from zoom level and if selected
  useEffect(() => {
    if (zoom) {
      const iconSize = zoom * 0.12;
      vector?.forEachFeature((f) => {
        f.setStyle(deliveryPointStyle(iconSize));
      });
    }
  }, [zoom, vector]);

  useEffect(
    () => setVector(generateDeliveryPointsVector(deliveryPoints)),
    [deliveryPoints],
  );

  return <VectorLayer source={vector} zIndex={4} />;
};

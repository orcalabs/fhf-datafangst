import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { VectorLayer } from "~/components";
import { useFishmapContext } from "~/hooks";
import { selectMapDeliveryPoints, useAppSelector } from "~/store";
import { deliveryPointStyle, generateDeliveryPointsVector } from "~/utils";

export const CurrentDeliveryPointsLayer: FC = () => {
  const { map } = useFishmapContext();

  const deliveryPoints = useAppSelector(selectMapDeliveryPoints);

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

  const vector = useMemo(
    () => generateDeliveryPointsVector(deliveryPoints),
    [deliveryPoints],
  );

  // Change icon size from zoom level and if selected
  useEffect(() => {
    if (zoom) {
      const iconSize = zoom * 0.12;
      vector?.forEachFeature((f) => {
        f.setStyle(deliveryPointStyle(iconSize));
      });
    }
  }, [zoom, vector]);

  return <VectorLayer source={vector} zIndex={4} />;
};

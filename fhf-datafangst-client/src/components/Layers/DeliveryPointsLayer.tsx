import type { FC } from "react";
import { useEffect, useMemo } from "react";
import { VectorLayer } from "~/components";
import { useFishmapContext } from "~/hooks";
import { selectDeliveryPoints, useAppSelector } from "~/store";
import { deliveryPointStyle, generateDeliveryPointsVector } from "~/utils";

export const DeliveryPointsLayer: FC = () => {
  const { zoom } = useFishmapContext();

  const deliveryPoints = useAppSelector(selectDeliveryPoints);

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

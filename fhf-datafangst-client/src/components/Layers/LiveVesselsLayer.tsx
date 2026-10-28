import { differenceInHours } from "date-fns";
import type { FC } from "react";
import { useEffect, useMemo } from "react";
import { VectorLayer } from "~/components";
import type { CurrentPosition } from "~/generated/openapi";
import { useFishmapContext } from "~/hooks";
import {
  selectCurrentPositions,
  selectSelectedLiveVessel,
  useAppSelector,
} from "~/store";
import { changeIconSizeFromFeature, generateLiveVesselsVector } from "~/utils";

const ZOOM_FACTOR = 0.018;

export const LiveVesselsLayer: FC = () => {
  const { zoom } = useFishmapContext();

  const positions = useAppSelector(selectCurrentPositions);
  const selectedPosition = useAppSelector(selectSelectedLiveVessel);

  const iconSize = zoom * ZOOM_FACTOR;

  const vector = useMemo(
    () => generateLiveVesselsVector(positions, iconSize, selectedPosition),
    [positions],
  );

  // Change icon size from zoom level and if selected
  useEffect(() => {
    vector.forEachFeature((feature) => {
      const pos = feature.get("livePosition") as CurrentPosition;
      const isSelected = pos.vesselId === selectedPosition?.vesselId;

      const isOld =
        differenceInHours(new Date(), new Date(pos.timestamp)) >
        Number(import.meta.env.VITE_VESSEL_MAP_THRESHOLD_HOURS);

      changeIconSizeFromFeature(
        feature,
        iconSize * (isSelected ? 2 : 1),
        isSelected,
        isOld,
      );
    });
  }, [iconSize, selectedPosition]);

  return <VectorLayer source={vector} zIndex={7} />;
};

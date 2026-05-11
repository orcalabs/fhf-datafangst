import type { FC } from "react";
import { useEffect, useMemo } from "react";
import { VectorLayer } from "~/components";
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
    vector.forEachFeature((f) =>
      changeIconSizeFromFeature(
        f,
        f.get("livePosition")?.vesselId === selectedPosition?.vesselId
          ? iconSize * 2
          : iconSize,
      ),
    );
  }, [iconSize, selectedPosition]);

  return <VectorLayer source={vector} zIndex={7} />;
};

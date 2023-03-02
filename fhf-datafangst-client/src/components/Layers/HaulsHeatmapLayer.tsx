import { FC, useEffect, useState } from "react";
import { findHighestHaulCatchWeight, generateHaulsHeatmap } from "utils";
import { HeatmapLayer } from "./HeatmapLayer";
import { selectFishmap, selectHauls, useAppSelector } from "store";

export const HaulsHeatmapLayer: FC = () => {
  const fishmap = useAppSelector(selectFishmap);
  const hauls = useAppSelector(selectHauls);

  const [blur, setBlur] = useState<number>(15);
  const [radius, setRadius] = useState<number>(2);

  const haulHeat = generateHaulsHeatmap(hauls);
  const highestCatchWeight = hauls ? findHighestHaulCatchWeight(hauls) : 0;

  // Calculate blur and radius on Heatmap based on zoom level.
  useEffect(() => {
    const initialZoom = fishmap.getView().getZoom();
    if (initialZoom) {
      setRadius(initialZoom * 3);
      setBlur(initialZoom * 3 + 3);
    }
    fishmap.on("moveend", function () {
      const zoom = fishmap.getView().getZoom();
      if (zoom) {
        setRadius(zoom * 3);
        setBlur(zoom * 3 + 3);
      }
    });
  }, [fishmap]);

  return (
    <>
      <HeatmapLayer
        source={haulHeat}
        blur={blur}
        radius={radius}
        weightDenominator={highestCatchWeight}
        zIndex={1}
      />
    </>
  );
};

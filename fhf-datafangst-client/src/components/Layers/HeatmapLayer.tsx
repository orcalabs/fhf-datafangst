import { FC, useEffect, useState } from "react";
import { Heatmap } from "ol/layer";
import { selectFishmap, useAppSelector } from "store";
import { Feature } from "ol";
import { Geometry } from "ol/geom";

interface Props {
  source: any;
  blur: number;
  radius: number;
  zIndex: number;
  weightDenominator: number;
}

// TODO: Change weighting to amount of fish caught
export const HeatmapLayer: FC<Props> = (props) => {
  const { source, blur, radius, weightDenominator, zIndex } = props;
  const fishmap = useAppSelector(selectFishmap);
  const [heatmap, setHeatmap] = useState<Heatmap>();

  useEffect(() => heatmap?.setBlur(blur), [blur, heatmap]);
  useEffect(() => heatmap?.setRadius(radius), [heatmap, radius]);
  useEffect(() => heatmap?.setZIndex(zIndex), [heatmap, zIndex]);

  useEffect(() => {
    if (!fishmap) return;

    const heatmapLayer = new Heatmap({
      source,
      opacity: 1,
      properties: { disableHitDetection: true },
      weight: (feature: Feature<Geometry>) =>
        feature.get("weight") / weightDenominator,
    });

    fishmap.addLayer(heatmapLayer);
    setHeatmap(heatmapLayer);

    return () => {
      if (fishmap) {
        setHeatmap(undefined);
        fishmap.removeLayer(heatmapLayer);
      }
    };
  }, [fishmap, source]);

  return null;
};

import type { Feature } from "ol";
import type { Geometry } from "ol/geom";
import { Heatmap } from "ol/layer";
import type { FC } from "react";
import { useEffect, useMemo } from "react";
import { useFishmapContext } from "~/hooks";

interface Props {
  source: any;
  blur: number;
  radius: number;
  weightDenominator: number;
  zIndex: number;
}

// TODO: Change weighting to amount of fish caught
export const HeatmapLayer: FC<Props> = ({
  source,
  blur,
  radius,
  weightDenominator,
  zIndex,
}) => {
  const { map } = useFishmapContext();

  const heatmap = useMemo(
    () =>
      new Heatmap({
        source,
        opacity: 0.75,
        weight: (feature: Feature<Geometry>) =>
          feature.get("weight") / weightDenominator,
      }),
    [source],
  );

  useEffect(() => heatmap?.setBlur(blur), [blur, heatmap]);
  useEffect(() => heatmap?.setRadius(radius), [heatmap, radius]);
  useEffect(() => heatmap?.setZIndex(zIndex), [heatmap, zIndex]);

  useEffect(() => {
    if (map) {
      map.addLayer(heatmap);
      return () => {
        map.removeLayer(heatmap);
      };
    }
  }, [map, heatmap]);

  return null;
};

import { FC, useCallback, useEffect } from "react";
import { generateHaulsVector } from "utils";
import {
  selectFishmap,
  selectHauls,
  selectSelectedGridsString,
  selectSelectedTrip,
  useAppSelector,
} from "store";
import WebGLPointsLayer from "ol/layer/WebGLPoints";

export const HaulsLayer: FC = () => {
  const hauls = useAppSelector(selectHauls);
  const fishmap = useAppSelector(selectFishmap);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const selectedTrip = useAppSelector(selectSelectedTrip);

  const removeLayer = useCallback(() => {
    for (const layer of fishmap.getLayers().getArray()) {
      if (layer.get("name") === "HaulsLayer") {
        fishmap.removeLayer(layer);
        return;
      }
    }
  }, [fishmap]);

  useEffect(() => {
    if (!selectedGrids.length || selectedTrip) {
      removeLayer();
      return;
    }

    if (!hauls.length) return;

    const source = generateHaulsVector(hauls);
    if (source) {
      const layer = new WebGLPointsLayer({
        source,
        zIndex: 5,
        properties: { name: "HaulsLayer" },
        style: {
          symbol: {
            symbolType: "circle",
            size: 6,
            color: ["color", ["get", "red"], ["get", "green"], ["get", "blue"]],
          },
        },
      });
      removeLayer();
      fishmap.addLayer(layer);

      return () => {
        removeLayer();
      };
    }
  }, [fishmap, removeLayer, hauls, selectedTrip]);

  return null;
};

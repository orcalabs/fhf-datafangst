import WebGLPointsLayer from "ol/layer/WebGLPoints";
import { FC, useCallback, useEffect } from "react";
import {
  selectFishmap,
  selectHauls,
  selectSelectedGridsString,
  selectSelectedOrCurrentTrip,
  useAppSelector,
} from "store";
import { generateHaulsVector } from "utils";

export const HaulsLayer: FC = () => {
  const hauls = useAppSelector(selectHauls);
  const fishmap = useAppSelector(selectFishmap);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const selectedTrip = useAppSelector(selectSelectedOrCurrentTrip);

  const removeLayer = useCallback(() => {
    for (const layer of fishmap.getLayers().getArray()) {
      if (layer.get("name") === "HaulsLayer") {
        fishmap.removeLayer(layer);
        layer.dispose();
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
          "circle-radius": 3,
          "circle-fill-color": [
            "color",
            ["get", "red"],
            ["get", "green"],
            ["get", "blue"],
          ],
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

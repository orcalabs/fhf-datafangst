import WebGLVectorLayer from "ol/layer/WebGLVector";
import type { FC } from "react";
import { useCallback, useEffect } from "react";
import { useFishmapContext } from "~/hooks";
import {
  selectHauls,
  selectSelectedGridsString,
  selectSelectedOrCurrentTrip,
  useAppSelector,
} from "~/store";
import { generateHaulsVector } from "~/utils";

export const HaulsLayer: FC = () => {
  const { map } = useFishmapContext();

  const hauls = useAppSelector(selectHauls);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const selectedTrip = useAppSelector(selectSelectedOrCurrentTrip);

  const removeLayer = useCallback(() => {
    for (const layer of map.getLayers().getArray()) {
      if (layer.get("name") === "HaulsLayer") {
        map.removeLayer(layer);
        return;
      }
    }
  }, [map]);

  useEffect(() => {
    if (!selectedGrids.length || selectedTrip) {
      removeLayer();
      return;
    }

    if (!hauls.length) return;

    const source = generateHaulsVector(hauls);
    if (source) {
      const layer = new WebGLVectorLayer({
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
      map.addLayer(layer);
      return () => {
        removeLayer();
      };
    }
  }, [map, removeLayer, hauls, selectedTrip]);

  return null;
};

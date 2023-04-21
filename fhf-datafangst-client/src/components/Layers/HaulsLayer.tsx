import { FC, useEffect } from "react";
import { generateHaulsVector } from "utils";
import { Haul } from "generated/openapi";
import {
  selectFishmap,
  selectHaulsByArea,
  selectSelectedGrids,
  useAppSelector,
} from "store";
import WebGLPointsLayer from "ol/layer/WebGLPoints";

export const HaulsLayer: FC = () => {
  const haulsByArea = useAppSelector(selectHaulsByArea);
  const selectedAreas = useAppSelector(selectSelectedGrids);
  const fishmap = useAppSelector(selectFishmap);

  const hauls = () => {
    const haulsArray: Haul[] = [];
    for (const [key, value] of Object.entries(haulsByArea)) {
      for (const area of selectedAreas) {
        if (key === area.get("lokref")) {
          haulsArray.push(...value);
        }
      }
    }
    return haulsArray;
  };

  useEffect(() => {
    if (!fishmap) return;

    const source = generateHaulsVector(hauls());
    if (source) {
      const layer = new WebGLPointsLayer({
        source,
        zIndex: 5,
        style: {
          symbol: {
            symbolType: "circle",
            size: 6,
            color: ["color", ["get", "red"], ["get", "green"], ["get", "blue"]],
          },
        },
      });
      fishmap.addLayer(layer);

      return () => {
        if (fishmap) {
          fishmap.removeLayer(layer);
        }
      };
    }
  }, [fishmap, haulsByArea]);

  return null;
};

import { FC, useEffect, useState } from "react";
import { generateHaulsVector } from "utils";
import {
  selectFishmap,
  selectHauls,
  selectSelectedGridsString,
  useAppSelector,
} from "store";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";

export const HaulsLayer: FC = () => {
  const hauls = useAppSelector(selectHauls);
  const fishmap = useAppSelector(selectFishmap);
  const selectedGrids = useAppSelector(selectSelectedGridsString);

  const [prevLayer, setPrevLayer] = useState<
    WebGLPointsLayer<VectorSource<Point>> | undefined
  >(undefined);

  useEffect(() => {
    if (!selectedGrids.length && prevLayer) {
      fishmap.removeLayer(prevLayer);
      return;
    }

    if (!hauls.length) return;

    const source = generateHaulsVector(hauls);
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
      if (prevLayer) {
        fishmap.removeLayer(prevLayer);
      }
      setPrevLayer(layer);
    }
  }, [fishmap, hauls, selectedGrids]);

  return null;
};

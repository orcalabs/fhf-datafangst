import { FC, useEffect, useState } from "react";
import {
  generateAreaTrafficDrawing,
  generateAreaTrafficHeatmap,
  BoundingBox,
  createNumVesselsText,
} from "utils";
import { HeatmapLayer } from "./HeatmapLayer";
import {
  getAreaTraffic,
  selectAreaTraffic,
  selectFishmap,
  useAppDispatch,
  useAppSelector,
} from "store";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import { VectorLayer } from "./VectorLayer";
import { subWeeks } from "date-fns";

export const AreaTrafficHeatmap: FC = () => {
  const dispatch = useAppDispatch();
  const fishmap = useAppSelector(selectFishmap);
  const aisVmsArea = useAppSelector(selectAreaTraffic);
  const [blur, setBlur] = useState<number>(15);
  const [radius, setRadius] = useState<number>(2);
  const [heatVector, setHeatVector] =
    useState<VectorSource<Feature<Geometry>>>();
  const [drawVector, setDrawVector] = useState<VectorSource<Feature<Geometry>>>(
    new VectorSource({ wrapX: false }),
  );
  const [numVesselsVector, setNumVesselsVector] =
    useState<VectorSource<Feature<Geometry>>>();
  const [boundingBox, setBoundingBox] = useState<BoundingBox>();

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

  useEffect(() => {
    if (aisVmsArea?.counts.length) {
      const areaHeat = generateAreaTrafficHeatmap(aisVmsArea?.counts);
      setHeatVector(areaHeat);
    }
  }, [aisVmsArea]);

  useEffect(() => {
    const areaDrawing = generateAreaTrafficDrawing(
      fishmap,
      (value: BoundingBox) => {
        dispatch(
          getAreaTraffic({ box: value, dateLimit: subWeeks(new Date(), 1) }),
        );
        setBoundingBox(value);
      },
    );
    setDrawVector(areaDrawing);
  }, []);

  // Draw a text box describing number of vessels the data is computed from
  useEffect(() => {
    if (boundingBox && aisVmsArea) {
      const textVector = createNumVesselsText(
        boundingBox?.x1,
        boundingBox?.y2,
        aisVmsArea?.numVessels ? aisVmsArea.numVessels : 0,
      );
      setNumVesselsVector(textVector);
    }
  }, [aisVmsArea, boundingBox]);

  return (
    <>
      {aisVmsArea?.counts.length && (
        <HeatmapLayer
          source={heatVector}
          blur={blur}
          radius={radius}
          weightDenominator={200}
          zIndex={3}
        />
      )}
      <VectorLayer source={drawVector} zIndex={3} />
      <VectorLayer source={numVesselsVector} zIndex={3} />
    </>
  );
};

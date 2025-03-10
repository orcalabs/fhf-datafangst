import { VectorLayer } from "components";
import { Feature } from "ol";
import Geometry from "ol/geom/Geometry";
import VectorSource from "ol/source/Vector";
import { FC, useEffect, useState } from "react";
import {
  selectCurrentPositions,
  selectFishmapState,
  selectSelectedLiveVessel,
  useAppSelector,
} from "store";
import { changeIconSizeFromFeature, generateLiveVesselsVector } from "utils";

const ZOOM_FACTOR = 0.018;

export const LiveVesselsLayer: FC = () => {
  const state = useAppSelector(selectFishmapState);
  const positions = useAppSelector(selectCurrentPositions);
  const selectedPosition = useAppSelector(selectSelectedLiveVessel);

  const [vector, setVector] = useState<VectorSource<Feature<Geometry>>>();
  const [iconSize, setIconSize] = useState<number | undefined>(
    (state.map.getView().getZoom() ?? 1) * ZOOM_FACTOR,
  );

  // Store map zoom level in state
  useEffect(() => {
    const fn = () => {
      const zoom = state.map.getView().getZoom();
      if (zoom) {
        setIconSize(zoom * ZOOM_FACTOR);
      }
    };
    state.map.on("moveend", fn);
    return () => state.map.un("moveend", fn);
  }, [state.map, state.zoom]);

  // Change icon size from zoom level and if selected
  useEffect(() => {
    if (iconSize) {
      vector?.forEachFeature((f) =>
        changeIconSizeFromFeature(
          f,
          f.get("livePosition")?.vesselId === selectedPosition?.vesselId
            ? iconSize * 2
            : iconSize,
        ),
      );
    }
  }, [iconSize, selectedPosition]);

  useEffect(() => {
    setVector(generateLiveVesselsVector(positions, iconSize, selectedPosition));
  }, [positions]);

  return <VectorLayer source={vector} zIndex={7} />;
};

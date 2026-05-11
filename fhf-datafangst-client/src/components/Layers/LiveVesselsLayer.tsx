import type { Feature } from "ol";
import type Geometry from "ol/geom/Geometry";
import type VectorSource from "ol/source/Vector";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { VectorLayer } from "~/components";
import { useFishmapContext } from "~/hooks";
import {
  selectCurrentPositions,
  selectSelectedLiveVessel,
  useAppSelector,
} from "~/store";
import { changeIconSizeFromFeature, generateLiveVesselsVector } from "~/utils";

const ZOOM_FACTOR = 0.018;

export const LiveVesselsLayer: FC = () => {
  const { map } = useFishmapContext();

  const positions = useAppSelector(selectCurrentPositions);
  const selectedPosition = useAppSelector(selectSelectedLiveVessel);

  const [vector, setVector] = useState<VectorSource<Feature<Geometry>>>();
  const [iconSize, setIconSize] = useState<number | undefined>(
    (map.getView().getZoom() ?? 1) * ZOOM_FACTOR,
  );

  // Store map zoom level in state
  useEffect(() => {
    const fn = () => {
      const zoom = map.getView().getZoom();
      if (zoom) {
        setIconSize(zoom * ZOOM_FACTOR);
      }
    };
    map.on("moveend", fn);
    return () => map.un("moveend", fn);
  }, [map]);

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

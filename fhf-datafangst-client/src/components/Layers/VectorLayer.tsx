import { Vector as OLVectorLayer } from "ol/layer";
import type { FC } from "react";
import { useEffect } from "react";
import { useFishmapContext } from "~/hooks";

interface Props {
  source: any;
  zIndex: number;
  style?: any;
  name?: string;
  opacity?: number;
}

export const VectorLayer: FC<Props> = ({
  source,
  style,
  zIndex,
  name,
  opacity = 1,
}) => {
  const { map } = useFishmapContext();

  useEffect(() => {
    if (!map) return;

    const vectorLayer = new OLVectorLayer({
      source,
      style,
      zIndex,
      properties: { name },
      opacity,
    });
    map.addLayer(vectorLayer);

    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [map, source, style, zIndex, opacity]);

  return null;
};

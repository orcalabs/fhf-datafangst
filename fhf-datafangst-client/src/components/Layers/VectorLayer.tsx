import { Vector as OLVectorLayer } from "ol/layer";
import type { FC } from "react";
import { useEffect } from "react";
import { useFishmapContext } from "~/hooks";

interface Props {
  source: any;
  zIndex: number;
  style?: any;
  name?: string;
}

export const VectorLayer: FC<Props> = ({ source, style, zIndex, name }) => {
  const { map } = useFishmapContext();

  useEffect(() => {
    if (!map) return;

    const vectorLayer = new OLVectorLayer({
      source,
      style,
      zIndex,
      properties: { name },
    });
    map.addLayer(vectorLayer);

    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [map, source, style, zIndex]);

  return null;
};

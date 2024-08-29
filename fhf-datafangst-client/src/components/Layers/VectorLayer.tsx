import { Vector as OLVectorLayer } from "ol/layer";
import { FC, useEffect } from "react";
import { selectFishmap, useAppSelector } from "store";

interface Props {
  source: any;
  zIndex: number;
  style?: any;
  name?: string;
}

export const VectorLayer: FC<Props> = (props) => {
  const { source, style, zIndex, name } = props;
  const fishmap = useAppSelector(selectFishmap);

  useEffect(() => {
    if (!fishmap) return;

    const vectorLayer = new OLVectorLayer({
      source,
      style,
      zIndex,
      properties: { name },
    });
    fishmap.addLayer(vectorLayer);

    return () => {
      if (fishmap) {
        fishmap.removeLayer(vectorLayer);
      }
    };
  }, [fishmap, source, style, zIndex]);

  return null;
};

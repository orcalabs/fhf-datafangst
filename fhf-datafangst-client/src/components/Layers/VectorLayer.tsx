import { FC, useEffect } from "react";
import { Vector as OLVectorLayer } from "ol/layer";
import { selectFishmap, useAppSelector } from "store";

interface Props {
  source: any;
  style?: any;
  zIndex: number;
}

export const VectorLayer: FC<Props> = (props) => {
  const { source, style, zIndex } = props;
  const fishmap = useAppSelector(selectFishmap);

  useEffect(() => {
    if (!fishmap) return;

    const vectorLayer = new OLVectorLayer({ source, style, zIndex });
    fishmap.addLayer(vectorLayer);

    return () => {
      if (fishmap) {
        fishmap.removeLayer(vectorLayer);
      }
    };
  }, [fishmap, source, style, zIndex]);

  return null;
};

import { MapboxVectorLayer } from "ol-mapbox-style";
import { FC, useEffect } from "react";
import { selectFishmap, useAppSelector } from "store";

interface Props {
  zIndex?: number;
}

export const MapBoxLayer: FC<Props> = (props) => {
  const { zIndex = 0 } = props;
  const fishmap = useAppSelector(selectFishmap);

  useEffect(() => {
    if (!fishmap) return;

    const vector = new MapboxVectorLayer({
      styleUrl: process.env.REACT_APP_MAPBOX_STYLE_URL as string,
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN as string,
      zIndex,
      properties: { disableHitDetection: true },
    });

    fishmap.addLayer(vector);

    return () => {
      if (fishmap) {
        fishmap.removeLayer(vector);
      }
    };
  }, [fishmap, zIndex]);

  return null;
};

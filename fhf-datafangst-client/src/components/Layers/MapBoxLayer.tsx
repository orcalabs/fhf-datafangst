import { MapboxVectorLayer } from "ol-mapbox-style";
import type { FC } from "react";
import { useEffect } from "react";
import { useFishmapContext } from "~/hooks";

interface Props {
  zIndex?: number;
}

export const MapBoxLayer: FC<Props> = ({ zIndex = 0 }) => {
  const { map } = useFishmapContext();

  useEffect(() => {
    if (!map) return;

    const vector = new MapboxVectorLayer({
      styleUrl: import.meta.env.VITE_MAPBOX_STYLE_URL as string,
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN as string,
      zIndex,
      properties: { disableHitDetection: true },
    });

    map.addLayer(vector);

    return () => {
      if (map) {
        map.removeLayer(vector);
      }
    };
  }, [map, zIndex]);

  return null;
};

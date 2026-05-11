import OLTileLayer from "ol/layer/Tile";
import { TileWMS } from "ol/source";
import type { FC } from "react";
import { useEffect } from "react";
import { useFishmapContext } from "~/hooks";

interface Props {
  zIndex?: number;
}

export const SeamapLayer: FC<Props> = ({ zIndex = 0 }) => {
  const { map } = useFishmapContext();

  useEffect(() => {
    if (!map) {
      return;
    }

    const seamapLayer = new OLTileLayer({
      source: new TileWMS({
        url: "https://wms.geonorge.no/skwms1/wms.sjokartraster2",
        params: { LAYERS: "all", TILED: true },
        transition: 0,
      }),
      zIndex,
      opacity: 1,
    });

    map.addLayer(seamapLayer);

    return () => {
      if (map) {
        map.removeLayer(seamapLayer);
      }
    };
  }, [map, zIndex]);

  return null;
};

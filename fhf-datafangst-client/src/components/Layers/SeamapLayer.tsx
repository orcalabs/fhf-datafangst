import OLTileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ.js";
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
      source: new XYZ({
        url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=sjokartraster&zoom={z}&x={x}&y={y}",
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

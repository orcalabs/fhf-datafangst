import { FC, useEffect } from "react";
import OLTileLayer from "ol/layer/Tile";
import { selectFishmap, useAppSelector } from "store";
import XYZ from "ol/source/XYZ.js";

interface Props {
  zIndex?: number;
}

export const SeamapLayer: FC<Props> = (props) => {
  const { zIndex = 0 } = props;
  const fishmap = useAppSelector(selectFishmap);

  useEffect(() => {
    if (!fishmap) {
      return;
    }

    const seamapLayer = new OLTileLayer({
      source: new XYZ({
        url: "https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=sjokartraster&zoom={z}&x={x}&y={y}",
      }),
      zIndex,
      opacity: 1,
    });

    fishmap.addLayer(seamapLayer);

    return () => {
      if (fishmap) {
        fishmap.removeLayer(seamapLayer);
      }
    };
  }, [fishmap, zIndex]);

  return null;
};

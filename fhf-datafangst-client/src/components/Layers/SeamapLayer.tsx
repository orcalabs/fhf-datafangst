import { FC, useEffect, useState } from "react";
import OLTileLayer from "ol/layer/Tile";
import { selectFishmap, selectSeamapCapabilities, useAppSelector } from "store";
import { parseCapabilites } from "utils";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";

interface Props {
  zIndex?: number;
}

export const SeamapLayer: FC<Props> = (props) => {
  const { zIndex = 0 } = props;
  const fishmap = useAppSelector(selectFishmap);
  const capabilities = useAppSelector(selectSeamapCapabilities);
  const [seamapSource, setSeamapSource] = useState<WMTS>();

  useEffect(() => {
    if (capabilities) {
      const parsedCapabilities = parseCapabilites(capabilities);
      const options = optionsFromCapabilities(parsedCapabilities, {
        layer: "sjokartraster",
        matrixSet: process.env.REACT_APP_EPSG as string,
      });

      // Spread requests among multiple caches
      if (options) {
        options.urls = [
          "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?",
          "https://opencache2.statkart.no/gatekeeper/gk/gk.open_wmts?",
          "https://opencache3.statkart.no/gatekeeper/gk/gk.open_wmts?",
        ];
        setSeamapSource(new WMTS(options));
      }
    }
  }, [capabilities]);

  useEffect(() => {
    if (!fishmap) {
      return;
    }

    const seamapLayer = new OLTileLayer({
      source: seamapSource,
      zIndex,
      opacity: 1,
    });

    fishmap.addLayer(seamapLayer);

    return () => {
      if (fishmap) {
        fishmap.removeLayer(seamapLayer);
      }
    };
  }, [fishmap, seamapSource, zIndex]);

  return null;
};

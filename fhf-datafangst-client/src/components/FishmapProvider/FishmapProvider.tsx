import { Map as OLMap, View } from "ol";
import { defaults } from "ol/control";
import { boundingExtent } from "ol/extent";
import { defaults as interactionDefaults } from "ol/interaction/defaults";
import { useState, type FC, type PropsWithChildren } from "react";
import { FishmapContext } from "~/hooks";
import { fromLonLat } from "~/utils";

const defaultCenter = [1904373.32, 10399403.38] satisfies [number, number];
const defaultZoom = 2.7;
const defaultZoomFactor = 3.7;

export const FishmapProvider: FC<PropsWithChildren> = (props) => {
  const [map, _] = useState(
    () =>
      new OLMap({
        target: "map",
        layers: [],
        view: new View({
          center: defaultCenter,
          zoom: defaultZoom,
          zoomFactor: defaultZoomFactor,
        }),
        controls: defaults({
          attribution: false,
          rotate: false,
          zoom: false,
        }),
        interactions: interactionDefaults({
          doubleClickZoom: false,
        }),
      }),
  );

  return (
    <FishmapContext
      value={{
        map,
        defaultCenter,
        defaultZoom,
        defaultZoomFactor,
        resetZoom: () => {
          map.getView().setCenter(defaultCenter);
          map.getView().setZoom(defaultZoomFactor);
          map.getView().setResolution(4576);
        },
        focusTrack: (track) => {
          if (track.length === 0) {
            return;
          }

          const coords = [];

          for (const pos of track) {
            coords.push(fromLonLat(pos.lon, pos.lat));
          }

          const extent = boundingExtent(coords);

          map
            .getView()
            .fit(extent, { padding: [100, 500, 100, 500], maxZoom: 4 });
        },
      }}
      {...props}
    />
  );
};

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
  const [zoom, setZoom] = useState(defaultZoom);
  const [map, _] = useState(() => {
    const view = new View({
      center: defaultCenter,
      zoom: defaultZoom,
      zoomFactor: defaultZoomFactor,
    });

    let timeout: number;

    view.on("change:resolution", () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const z = view.getZoom();
        if (z) {
          setZoom(z);
        }
      }, 100);
    });

    return new OLMap({
      layers: [],
      view,
      controls: defaults({
        attribution: false,
        rotate: false,
        zoom: false,
      }),
      interactions: interactionDefaults({
        doubleClickZoom: false,
      }),
    });
  });

  return (
    <FishmapContext
      value={{
        map,
        zoom,
        defaultCenter,
        defaultZoom,
        defaultZoomFactor,
        resetZoom: () => {
          map.getView().setCenter(defaultCenter);
          map.getView().setZoom(defaultZoom);
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

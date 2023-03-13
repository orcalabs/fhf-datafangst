import React, { FC, useEffect } from "react";
import { defaults } from "ol/control";
import { View, Map as OLMap, MapBrowserEvent } from "ol";
import { Box } from "@mui/material";
import { Types } from "ol/MapBrowserEventType";

import {
  initializeMap,
  selectFishmapState,
  store,
  toggleSelectedArea,
  useAppDispatch,
  useAppSelector,
} from "store";
import Feature, { FeatureLike } from "ol/Feature";
import { Geometry } from "ol/geom";
import RenderFeature from "ol/render/Feature";

interface Props {
  children: React.ReactNode;
}

// Background map from Mapbox returns as RenderFeature.
const pixelFeature = (feature: FeatureLike): Feature<Geometry> | undefined =>
  feature instanceof RenderFeature ? undefined : feature;

export const Map: FC<Props> = (props) => {
  const { children } = props;
  const dispatch = useAppDispatch();
  const mapState = useAppSelector(selectFishmapState);

  useEffect(() => {
    const map = new OLMap({
      target: "map",
      layers: [],
      view: new View({
        center: mapState.centerCoordinate,
        zoom: mapState.zoom,
        zoomFactor: mapState.zoomFactor,
      }),
      controls: defaults({
        attribution: false,
        rotate: false,
        zoom: false,
      }),
    });

    dispatch(initializeMap(map));
  }, [dispatch, mapState.centerCoordinate, mapState.zoom, mapState.zoomFactor]);

  useEffect(() => {
    const handleClick = (type: Types) => {
      mapState.map.on(type, (evt: MapBrowserEvent<any>) => {
        if (evt.dragging) {
          return;
        }
        const feature = mapState.map.forEachFeatureAtPixel(
          evt.pixel,
          pixelFeature,
        );
        if (feature) {
          const grid = feature.get("lokref");

          // Avoid registering clicks on areas without catches
          if (grid && store.getState().haulsGrid?.grid[grid]) {
            dispatch(toggleSelectedArea(feature));
          }
        } else {
          // dispatch(resetState());
        }
      });
    };

    handleClick("click");
  }, [dispatch, mapState.map]);

  return (
    <Box id={"map"} sx={{ height: "100vh", width: "100%" }}>
      {children}
    </Box>
  );
};

import React, { FC, useEffect } from "react";
import { defaults } from "ol/control";
import { View, Map as OLMap, MapBrowserEvent } from "ol";
import { Box } from "@mui/material";
import { Types } from "ol/MapBrowserEventType";

import {
  initializeMap,
  selectFishmapState,
  selectSelectedGrids,
  setSelectedGrids,
  useAppDispatch,
  useAppSelector,
} from "store";
import Feature, { FeatureLike } from "ol/Feature";
import { Geometry } from "ol/geom";
import RenderFeature from "ol/render/Feature";
import { Stroke, Style } from "ol/style";

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
  const selectedGrids = useAppSelector(selectSelectedGrids);

  const handleGridSelect = (grid: Feature<Geometry>) => {
    const grids = [...selectedGrids];
    const selectedIndex = grids.indexOf(grid);
    if (selectedIndex < 0) {
      const style = grid.getStyle() as Style;
      grids.push(grid);
      style.setStroke(new Stroke({ color: "#ffffff", width: 2 }));
      style.setZIndex(1000);

      grid.changed();
      // grid.setStyle(selectedGridBoxStyle(grid.get("lokref")));
    } else {
      const removed = grids.splice(selectedIndex, 1);
      const style = removed[0].getStyle() as Style;
      // removed[0].setStyle(defaultGridBoxStyle(removed[0].get("lokref")));
      style.setStroke(new Stroke({ color: "rgba(255, 0, 0, 0)" }));
      removed[0].changed();
    }

    dispatch(setSelectedGrids(grids));
  };

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

          if (grid) {
            handleGridSelect(feature);
          }
        } else {
          // dispatch(resetState());
        }
      });
    };

    handleClick("click");
  }, [dispatch, mapState.map, handleGridSelect]);

  return (
    <Box id={"map"} sx={{ height: "100vh", width: "100%" }}>
      {children}
    </Box>
  );
};

import React, { FC, useEffect, useState } from "react";
import { defaults } from "ol/control";
import { View, Map as OLMap, MapBrowserEvent } from "ol";
import { Box, Popover, PopoverPosition } from "@mui/material";
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
import { AisPosition, Haul } from "generated/openapi";
import { HaulPopover, PositionPopover, ShorelinePopover } from "components";

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
  const [hoveredPosition, setHoveredPosition] = useState<AisPosition>();
  const [hoveredShoreline, setHoveredShoreline] = useState<boolean>(false);
  const [hoveredHaul, setHoveredHaul] = useState<Haul>();
  const [anchorPos, setAnchorPos] = useState<PopoverPosition>();

  const handleClosePopover = () => {
    setAnchorPos(undefined);
  };

  const open = Boolean(anchorPos);

  const resetHover = () => {
    setHoveredPosition(undefined);
    setHoveredShoreline(false);
    setHoveredHaul(undefined);
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

          // Avoid registering clicks on areas without catches
          if (grid && store.getState().haulsGrid?.grid[grid]) {
            dispatch(toggleSelectedArea(feature));
          }
        } else {
          // dispatch(resetState());
        }
      });
    };

    mapState.map.on("pointermove", function (evt) {
      if (evt.dragging) {
        return;
      }

      mapState.map.getTargetElement().style.cursor = "";
      resetHover();
      handleClosePopover();

      const feature = mapState.map.forEachFeatureAtPixel(
        evt.pixel,
        pixelFeature,
      );

      if (feature) {
        const aisPosition = feature.get("aisPosition");
        const shoreLine = feature.getGeometryName();
        const haul = feature.get("haul");

        if (aisPosition) {
          setHoveredPosition(aisPosition);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (shoreLine === "shoreline") {
          setHoveredShoreline(true);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (haul) {
          mapState.map.getTargetElement().style.cursor = "pointer";
          setHoveredHaul(haul);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        }
      }
    });

    handleClick("click");
  }, [dispatch, mapState.map]);

  return (
    <>
      <Popover
        sx={{ pointerEvents: "none" }}
        PaperProps={{ square: true }}
        open={open}
        elevation={5}
        disableRestoreFocus
        onClose={handleClosePopover}
        anchorReference="anchorPosition"
        anchorPosition={anchorPos}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        transitionDuration={0}
      >
        {hoveredPosition && (
          <PositionPopover hoveredPosition={hoveredPosition} />
        )}
        {hoveredShoreline && <ShorelinePopover />}
        {hoveredHaul && <HaulPopover haul={hoveredHaul} />}
      </Popover>
      <Box id={"map"} sx={{ height: "100vh", width: "100%" }}>
        {children}
      </Box>
    </>
  );
};

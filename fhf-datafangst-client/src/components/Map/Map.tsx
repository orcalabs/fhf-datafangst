import React, { FC, useEffect, useState } from "react";
import { defaults } from "ol/control";
import { View, Map as OLMap, MapBrowserEvent } from "ol";
import { Box, Popover, PopoverPosition } from "@mui/material";
import { Types } from "ol/MapBrowserEventType";
import {
  initializeMap,
  selectFishmapState,
  setSelectedHaul,
  toggleSelectedArea,
  useAppDispatch,
  useAppSelector,
} from "store";
import Feature, { FeatureLike } from "ol/Feature";
import { Geometry } from "ol/geom";
import RenderFeature from "ol/render/Feature";
import { AisVmsPosition } from "generated/openapi";
import { HaulPopover, PositionPopover, ShorelinePopover } from "components";
import { FishingFacilityPopover } from "./FishingFacilityPopover";

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
  const [hoveredPosition, setHoveredPosition] = useState<AisVmsPosition>();
  const [hoveredShoreline, setHoveredShoreline] = useState<boolean>(false);
  const [hoveredHaulIdx, setHoveredHaulIdx] = useState<number>();
  const [hoveredFishingFacilityIdx, setHoveredFishingFacilityIdx] =
    useState<number>();
  const [anchorPos, setAnchorPos] = useState<PopoverPosition>();

  const handleClosePopover = () => {
    setAnchorPos(undefined);
  };

  const open = Boolean(anchorPos);

  const resetHover = () => {
    setHoveredPosition(undefined);
    setHoveredShoreline(false);
    setHoveredHaulIdx(undefined);
    setHoveredFishingFacilityIdx(undefined);
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
          const haulIdx = feature.get("haulIdx");

          // Avoid registering clicks on areas without catches
          if (grid && feature.get("weight") > 0) {
            dispatch(toggleSelectedArea(feature));
          } else if (haulIdx !== undefined) {
            dispatch(setSelectedHaul(haulIdx));
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
        const haulIdx = feature.get("haulIdx");
        const fishingFacilityIdx = feature.get("fishingFacilityIdx");

        if (aisPosition) {
          setHoveredPosition(aisPosition);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (shoreLine === "shoreline") {
          setHoveredShoreline(true);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (haulIdx !== undefined) {
          mapState.map.getTargetElement().style.cursor = "pointer";
          setHoveredHaulIdx(haulIdx);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (fishingFacilityIdx !== undefined) {
          mapState.map.getTargetElement().style.cursor = "pointer";
          setHoveredFishingFacilityIdx(fishingFacilityIdx);
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
        {hoveredHaulIdx !== undefined && (
          <HaulPopover haulIdx={hoveredHaulIdx} />
        )}
        {hoveredFishingFacilityIdx !== undefined && (
          <FishingFacilityPopover
            fishingFacilityIdx={hoveredFishingFacilityIdx}
          />
        )}
      </Popover>
      <Box id={"map"} sx={{ height: "100vh", width: "100%" }}>
        {children}
      </Box>
    </>
  );
};

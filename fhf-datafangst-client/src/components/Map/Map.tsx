import { Box, Popover, PopoverPosition } from "@mui/material";
import {
  DeliveryPointPopover,
  DetailedHaulPopover,
  HaulPopover,
  PositionPopover,
  ShorelinePopover,
  TransferPopover,
} from "components";
import { AisVmsPosition, DeliveryPoint, Haul, Tra } from "generated/openapi";
import { Map as OLMap, MapBrowserEvent, View } from "ol";
import { defaults, MousePosition, ScaleLine } from "ol/control";
import { Coordinate, toStringHDMS } from "ol/coordinate";
import { pointerMove } from "ol/events/condition";
import Feature, { FeatureLike } from "ol/Feature";
import { Geometry } from "ol/geom";
import { defaults as interactionDefaults } from "ol/interaction/defaults";
import Select from "ol/interaction/Select";
import { Types } from "ol/MapBrowserEventType";
import RenderFeature from "ol/render/Feature";
import React, { FC, useEffect, useState } from "react";
import {
  initializeMap,
  selectFishingFacilities,
  selectFishmapState,
  selectSelectedOrCurrentTrip,
  setSelectedFishingFacility,
  setSelectedHaul,
  setSelectedTripHaul,
  store,
  toggleSelectedArea,
  useAppDispatch,
  useAppSelector,
} from "store";
import { fishingFacilityStyle, tripHaulStyle } from "utils";
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
  const [hoveredShoreline, setHoveredShoreline] = useState<string>();
  const [hoveredHaulId, setHoveredHaulId] = useState<number>();
  const [hoveredFishingFacilityIdx, setHoveredFishingFacilityIdx] =
    useState<number>();
  const [hoveredHaul, setHoveredHaul] = useState<Haul>();
  const [hoveredDeliveryPoint, setHoveredDeliveryPoint] =
    useState<DeliveryPoint>();
  const [hoveredTransfer, setHoveredTransfer] = useState<Tra>();
  const [anchorPos, setAnchorPos] = useState<PopoverPosition>();
  const fishingFacilities = useAppSelector(selectFishingFacilities);
  const selectedTrip = useAppSelector(selectSelectedOrCurrentTrip);
  let disableHitDetection = false;

  const handleClosePopover = () => {
    setAnchorPos(undefined);
  };

  const open = Boolean(anchorPos);

  const resetHover = () => {
    setHoveredPosition(undefined);
    setHoveredShoreline(undefined);
    setHoveredHaulId(undefined);
    setHoveredFishingFacilityIdx(undefined);
    setHoveredHaul(undefined);
    setHoveredDeliveryPoint(undefined);
    setHoveredTransfer(undefined);
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
      interactions: interactionDefaults({
        doubleClickZoom: false,
      }),
    });

    const scaleLineControl = new ScaleLine({
      units: "metric",
      target: "scale-line",
    });

    const coordinateControl = new MousePosition({
      coordinateFormat: (coord) => toStringHDMS(coord as Coordinate, 2),
      projection: "EPSG:4326",
      target: "map-coordinate",
    });

    map.addControl(scaleLineControl);
    map.addControl(coordinateControl);

    // Interaction for handling hover effect on Hauls
    const hoverInteraction = new Select({
      condition: pointerMove,
      // Limit hit detection to targeted layer
      layers: (layer) => layer.get("name") === "tripHaulsLayer",
      filter: (feature) => {
        // Ignore hover effect on selected hauls
        const feat = pixelFeature(feature);
        const haul = feat?.get("haul");
        if (haul && haul.haulId !== store.getState().selectedTripHaul?.haulId) {
          return true;
        }

        return false;
      },
      style: (feature) => {
        const zoom = store.getState().map.getView().getZoom();
        const feat = pixelFeature(feature);

        feat?.set("hovered", true, true);

        return tripHaulStyle(zoom ? zoom * 3 : mapState.zoom * 3, true, true);
      },
    });

    // Interaction for handling hover effect on Gears
    const gearHoverInteraction = new Select({
      condition: pointerMove,
      // Limit hit detection to targeted layer
      layers: (layer) => layer.get("name") === "gearsLayer",
      filter: (feature) => {
        // Ignore hover effect on selected gears
        const feat = pixelFeature(feature);
        const gear = feat?.get("fishingFacilityIdx");
        const gears = store.getState().fishingFacilities;
        if (
          gear !== undefined &&
          gears &&
          gears[gear].toolId !==
            store.getState().selectedFishingFacility?.toolId
        ) {
          return true;
        }
        return false;
      },
      style: (feature) => {
        const feat = pixelFeature(feature);
        const toolType = feat?.get("toolType");
        const geometry = feat?.getGeometry();

        feat?.set("hovered", true, true);

        return fishingFacilityStyle(toolType, geometry, true);
      },
    });

    // Listener for applying correct icon size from zoom level when deselecting a Haul.
    hoverInteraction.on("select", (e) => {
      const zoom = store.getState().map.getView().getZoom();
      for (const f of e.deselected) {
        f.setStyle(tripHaulStyle(zoom ? zoom * 3 : mapState.zoom * 3));
        f.unset("hovered", true);
      }
    });

    map.addInteraction(hoverInteraction);
    map.addInteraction(gearHoverInteraction);

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
          {
            layerFilter: (layer) => !layer.get("disableHitDetection"),
          },
        );
        if (feature) {
          const grid = feature.get("lokref");
          const haulId = feature.get("haulId");
          const haul = feature.get("haul");
          const gearIdx = feature.get("fishingFacilityIdx");

          // Avoid registering clicks on areas without catches
          if (grid && feature.get("weight") > 0) {
            dispatch(toggleSelectedArea(feature));
          } else if (haulId !== undefined) {
            dispatch(setSelectedHaul(haulId));
          } else if (haul) {
            if (haul.haulId === store.getState().selectedTripHaul?.haulId) {
              dispatch(setSelectedTripHaul(undefined));
              return;
            }
            dispatch(setSelectedTripHaul(haul));
          } else if (gearIdx !== undefined) {
            if (
              fishingFacilities &&
              fishingFacilities[gearIdx].toolId ===
                store.getState().selectedFishingFacility?.toolId
            ) {
              dispatch(setSelectedFishingFacility(undefined));
              return;
            }
            dispatch(setSelectedFishingFacility(gearIdx));
          }
        } else {
          // dispatch(resetState());
        }
      });
    };

    // Hacky solution to the slow performance of OpenLayers' hit detection with WebGL Points Layer.
    // By disabling pointer move event during panning we avoid lagg on high resolution monitors.
    mapState.map.on("movestart", function (_) {
      disableHitDetection = true;
    });
    mapState.map.on("moveend", function (_) {
      disableHitDetection = false;
    });

    mapState.map.getView().on("change:resolution", function (_) {
      disableHitDetection = true;
    });

    mapState.map.on("pointermove", function (evt) {
      if (evt.dragging || disableHitDetection) {
        return;
      }
      mapState.map.getTargetElement().style.cursor = "";
      resetHover();
      handleClosePopover();

      const feature = mapState.map.forEachFeatureAtPixel(
        evt.pixel,
        pixelFeature,
        {
          layerFilter: (layer) => !layer?.get("disableHitDetection"),
        },
      );

      if (feature) {
        const aisPosition = feature.get("aisPosition");
        const shoreLine = feature.getProperties();
        const haulId = feature.get("haulId");
        const fishingFacilityIdx = feature.get("fishingFacilityIdx");
        const haul = feature.get("haul");
        const deliveryPoint = feature.get("deliveryPoint");
        const transfer = feature.get("tra");

        if (aisPosition) {
          setHoveredPosition(aisPosition);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (
          shoreLine.navn === "12 nautiske mil" ||
          shoreLine.navn === "4 nautiske mil"
        ) {
          setHoveredShoreline(shoreLine.navn);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (haulId !== undefined) {
          mapState.map.getTargetElement().style.cursor = "pointer";
          setHoveredHaulId(haulId);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (fishingFacilityIdx !== undefined) {
          if (!selectedTrip) {
            mapState.map.getTargetElement().style.cursor = "pointer";
          }
          setHoveredFishingFacilityIdx(fishingFacilityIdx);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (haul !== undefined) {
          mapState.map.getTargetElement().style.cursor = "pointer";
          setHoveredHaul(haul);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (deliveryPoint) {
          mapState.map.getTargetElement().style.cursor = "pointer";
          setHoveredDeliveryPoint(deliveryPoint);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] - 20 });
        } else if (transfer) {
          mapState.map.getTargetElement().style.cursor = "pointer";
          setHoveredTransfer(transfer);
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
        {hoveredShoreline && <ShorelinePopover name={hoveredShoreline} />}
        {hoveredDeliveryPoint && (
          <DeliveryPointPopover deliveryPoint={hoveredDeliveryPoint} />
        )}
        {hoveredHaulId !== undefined && <HaulPopover haulId={hoveredHaulId} />}
        {hoveredFishingFacilityIdx !== undefined && (
          <FishingFacilityPopover
            fishingFacilityIdx={hoveredFishingFacilityIdx}
          />
        )}
        {hoveredHaul && <DetailedHaulPopover haul={hoveredHaul} />}
        {hoveredTransfer && <TransferPopover transfer={hoveredTransfer} />}
      </Popover>
      <Box id={"map"} sx={{ height: "100vh", width: "100%" }}>
        {children}
      </Box>
    </>
  );
};

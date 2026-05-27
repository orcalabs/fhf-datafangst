import type { PopoverPosition } from "@mui/material";
import { Box, Popover } from "@mui/material";
import type { MapBrowserEvent } from "ol";
import MousePosition from "ol/control/MousePosition";
import ScaleLine from "ol/control/ScaleLine";
import { toStringHDMS, type Coordinate } from "ol/coordinate";
import { pointerMove } from "ol/events/condition";
import Select from "ol/interaction/Select";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import {
  DeliveryPointPopover,
  DetailedHaulPopover,
  HaulPopover,
  MapBoxLayer,
  PositionPopover,
  ShorelinePopover,
  TransferPopover,
} from "~/components";
import type {
  AisVmsPosition,
  CurrentPosition,
  DeliveryPoint,
  Haul,
  Tra,
} from "~/generated/openapi";
import { pixelFeature, useFishmapContext, useQueryParams } from "~/hooks";
import {
  resetState,
  selectSelectedOrCurrentTrip,
  setSelectedFishingFacility,
  setSelectedHaul,
  setSelectedTripHaul,
  store,
  toggleSelectedArea,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { fishingFacilityStyle, tripHaulStyle } from "~/utils";
import { FishingFacilityPopover } from "./FishingFacilityPopover";
import { LivePositionPopover } from "./LivePositionPopover";

interface Props {
  children?: React.ReactNode;
}

export const Map: FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [_, setParams] = useQueryParams();

  const { map, defaultZoom } = useFishmapContext();

  const selectedTrip = useAppSelector(selectSelectedOrCurrentTrip);

  const [hoveredPosition, setHoveredPosition] = useState<AisVmsPosition>();
  const [hoveredLivePosition, setHoveredLivePosition] =
    useState<CurrentPosition>();
  const [hoveredShoreline, setHoveredShoreline] = useState<string>();
  const [hoveredHaulId, setHoveredHaulId] = useState<number>();
  const [hoveredFishingFacilityIdx, setHoveredFishingFacilityIdx] =
    useState<number>();
  const [hoveredHaul, setHoveredHaul] = useState<Haul>();
  const [hoveredDeliveryPoint, setHoveredDeliveryPoint] =
    useState<DeliveryPoint>();
  const [hoveredTransfer, setHoveredTransfer] = useState<Tra>();
  const [anchorPos, setAnchorPos] = useState<PopoverPosition>();

  const handleClosePopover = () => {
    setAnchorPos(undefined);
  };

  const open = Boolean(anchorPos);

  const resetHover = () => {
    setHoveredPosition(undefined);
    setHoveredLivePosition(undefined);
    setHoveredShoreline(undefined);
    setHoveredHaulId(undefined);
    setHoveredFishingFacilityIdx(undefined);
    setHoveredHaul(undefined);
    setHoveredDeliveryPoint(undefined);
    setHoveredTransfer(undefined);
  };

  useEffect(() => {
    map.setTarget(undefined);
    map.setTarget("map");

    const scaleLine = new ScaleLine({
      units: "metric",
      target: "scale-line",
    });

    const mousePosition = new MousePosition({
      coordinateFormat: (coord) => toStringHDMS(coord as Coordinate, 2),
      projection: "EPSG:4326",
      target: "map-coordinate",
    });

    // Interaction for handling hover effect on Hauls
    const hoverInteraction = new Select({
      condition: pointerMove,
      // Limit hit detection to targeted layer
      layers: (layer) => layer.get("name") === "tripHaulsLayer",
      filter: (feature) => {
        // Ignore hover effect on selected hauls
        const feat = pixelFeature(feature);
        const haul = feat?.get("haul");
        if (haul && haul.id !== store.getState().selectedTripHaul?.id) {
          return true;
        }

        return false;
      },
      style: (feature) => {
        const zoom = map.getView().getZoom() ?? defaultZoom;
        const feat = pixelFeature(feature);

        feat?.set("hovered", true, true);

        return tripHaulStyle(zoom * 3, true, true);
      },
    });

    map.addControl(scaleLine);
    map.addControl(mousePosition);

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
      const zoom = map.getView().getZoom() ?? defaultZoom;
      for (const f of e.deselected) {
        f.setStyle(tripHaulStyle(zoom * 3));
        f.unset("hovered", true);
      }
    });

    map.addInteraction(hoverInteraction);
    map.addInteraction(gearHoverInteraction);

    const click = (evt: MapBrowserEvent) => {
      if (evt.dragging) {
        return;
      }
      const feature = map.forEachFeatureAtPixel(evt.pixel, pixelFeature, {
        layerFilter: (layer) => !layer.get("disableHitDetection"),
      });
      if (feature) {
        const grid = feature.get("lokref");
        const haulId = feature.get("haulId");
        const haul = feature.get("haul");
        const gearIdx = feature.get("fishingFacilityIdx");
        const livePosition = feature.get("livePosition") as CurrentPosition;

        // Avoid registering clicks on areas without catches
        if (grid && feature.get("weight") > 0) {
          dispatch(toggleSelectedArea(feature));
        } else if (haulId !== undefined) {
          dispatch(setSelectedHaul(haulId));
        } else if (haul) {
          if (haul.id === store.getState().selectedTripHaul?.id) {
            dispatch(setSelectedTripHaul(undefined));
            return;
          }
          dispatch(setSelectedTripHaul(haul));
        } else if (gearIdx !== undefined) {
          const fishingFacilities = store.getState().fishingFacilities;
          if (
            fishingFacilities &&
            fishingFacilities[gearIdx].toolId ===
              store.getState().selectedFishingFacility?.toolId
          ) {
            dispatch(setSelectedFishingFacility(undefined));
            return;
          }
          dispatch(setSelectedFishingFacility(gearIdx));
        } else if (livePosition) {
          const vessels = store.getState().vesselsByFiskeridirId;
          const callSign = vessels?.[livePosition.vesselId].fiskeridir.callSign;

          if (callSign) {
            setParams({ callSign });
          }
        }
      } else {
        if (store.getState().selectedLiveVessel !== undefined) {
          dispatch(resetState());
          setParams({});
        }
      }
    };

    map.on("click", click);

    let disableHitDetection = false;

    // Hacky solution to the slow performance of OpenLayers' hit detection with WebGL Points Layer.
    // By disabling pointer move event during panning we avoid lagg on high resolution monitors.
    const view = map.getView();
    const disableHitDetectionTrue = () => (disableHitDetection = true);
    const disableHitDetectionFalse = () => (disableHitDetection = false);

    map.on("movestart", disableHitDetectionTrue);
    map.on("moveend", disableHitDetectionFalse);
    view.on("change:resolution", disableHitDetectionTrue);

    const pointermove = (evt: MapBrowserEvent) => {
      if (evt.dragging || disableHitDetection) {
        return;
      }
      map.getTargetElement().style.cursor = "";
      resetHover();
      handleClosePopover();

      const feature = map.forEachFeatureAtPixel(evt.pixel, pixelFeature, {
        layerFilter: (layer) => !layer?.get("disableHitDetection"),
      });

      if (feature) {
        const weightedArea = feature.get("weight");
        const aisPosition = feature.get("aisPosition");
        const livePosition = feature.get("livePosition");
        const shoreLine = feature.getProperties();
        const haulId = feature.get("haulId");
        const fishingFacilityIdx = feature.get("fishingFacilityIdx");
        const haul = feature.get("haul");
        const deliveryPoint = feature.get("deliveryPoint");
        const transfer = feature.get("tra");

        if (aisPosition) {
          setHoveredPosition(aisPosition);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] + 32 });
        } else if (livePosition) {
          setHoveredLivePosition(livePosition);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] + 32 });
          map.getTargetElement().style.cursor = "pointer";
        } else if (
          shoreLine.navn === "12 nautiske mil" ||
          shoreLine.navn === "4 nautiske mil"
        ) {
          setHoveredShoreline(shoreLine.navn);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] + 32 });
        } else if (weightedArea && weightedArea !== 0) {
          map.getTargetElement().style.cursor = "pointer";
        } else if (haulId !== undefined) {
          map.getTargetElement().style.cursor = "pointer";
          setHoveredHaulId(haulId);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] + 32 });
        } else if (fishingFacilityIdx !== undefined) {
          if (!selectedTrip) {
            map.getTargetElement().style.cursor = "pointer";
          }
          setHoveredFishingFacilityIdx(fishingFacilityIdx);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] + 32 });
        } else if (haul !== undefined) {
          map.getTargetElement().style.cursor = "pointer";
          setHoveredHaul(haul);
          setAnchorPos({ left: evt.pixel[0] + 10, top: evt.pixel[1] + 52 });
        } else if (deliveryPoint) {
          setHoveredDeliveryPoint(deliveryPoint);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] + 32 });
        } else if (transfer) {
          setHoveredTransfer(transfer);
          setAnchorPos({ left: evt.pixel[0], top: evt.pixel[1] + 32 });
        }
      }
    };

    map.on("pointermove", pointermove);

    return () => {
      map.setTarget(undefined);

      map.removeControl(scaleLine);
      map.removeControl(mousePosition);

      map.removeInteraction(hoverInteraction);
      map.removeInteraction(gearHoverInteraction);

      map.un("click", click);

      map.un("movestart", disableHitDetectionTrue);
      map.un("moveend", disableHitDetectionFalse);
      view.un("change:resolution", disableHitDetectionTrue);

      map.un("pointermove", pointermove);
    };
  }, [map]);

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
        anchorOrigin={{
          vertical: hoveredHaul ? "center" : "top",
          horizontal: hoveredHaul ? "right" : "center",
        }}
        transformOrigin={{
          vertical: hoveredHaul ? "top" : "bottom",
          horizontal: hoveredHaul ? "left" : "center",
        }}
        transitionDuration={0}
      >
        {hoveredPosition && (
          <PositionPopover hoveredPosition={hoveredPosition} />
        )}
        {hoveredLivePosition && (
          <LivePositionPopover position={hoveredLivePosition} />
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
      <Box id={"map"} sx={{ height: "100%", width: "100%" }}>
        <MapBoxLayer />
        {children}
      </Box>
    </>
  );
};

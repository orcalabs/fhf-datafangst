import { Box, Typography } from "@mui/material";
import { Feature, type MapBrowserEvent } from "ol";
import { type Coordinate } from "ol/coordinate";
import { LineString, Point } from "ol/geom";
import Translate from "ol/interaction/Translate";
import VectorSource from "ol/source/Vector";
import { getLength } from "ol/sphere";
import { Fill, Stroke, Style, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import { VectorLayer } from "~/components";
import type { AisVmsPosition } from "~/generated/openapi";
import { pixelFeature, useFishmapContext } from "~/hooks";
import {
  createDurationFromHours,
  fromLonLat,
  kilosOrTonsFormatter,
  KNOTS_TO_MS,
  metersOrNauticalMilesFormatter,
} from "~/utils";

export interface Route {
  distance: number;
  steamingFuel: number;
}

interface Props {
  selected: boolean;
  targetWeight?: number;
  speciesPrice?: number;
  haulTime?: number;
  haulFuelPerDay?: number;
  steamFuelPerDay?: number;
  steamSpeedKnots?: number;
  fuelPrice?: number;
  initialPoint?: AisVmsPosition;
  showDistance?: boolean;
  onChange: (route: Route) => void;
}

export const TripPlannerRoute: FC<Props> = ({
  selected,
  targetWeight,
  speciesPrice,
  haulTime,
  haulFuelPerDay,
  steamFuelPerDay,
  steamSpeedKnots,
  fuelPrice,
  initialPoint,
  showDistance,
  onChange,
}) => {
  const { map, zoom } = useFishmapContext();

  const updateLinesRef = useRef(() => {});
  const addPointRef = useRef((_: Coordinate) => {});
  const prevShowDistance = useRef(showDistance);

  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [steamingFuel, setSteamingFuel] = useState<number | undefined>(
    undefined,
  );

  const pointsSource = useMemo(() => new VectorSource(), []);
  const linesSource = useMemo(() => new VectorSource(), []);

  const steamSpeedMs =
    steamSpeedKnots !== undefined ? steamSpeedKnots * KNOTS_TO_MS : undefined;

  const steamFuelPerMeter =
    steamFuelPerDay !== undefined && steamSpeedMs !== undefined
      ? steamFuelPerDay / (24 * 60 * 60) / steamSpeedMs
      : undefined;

  const updateLines = useCallback(() => {
    linesSource.clear();

    const coords = pointsSource
      .getFeatures()
      .toSorted((a, b) => a.get("pointIndex") - b.get("pointIndex"))
      .map((f) => (f.getGeometry() as Point).getCoordinates());

    if (coords.length <= 1) {
      return;
    }

    let dist = 0;
    let steamFuel = 0;

    for (let i = 0; i < coords.length - 1; i++) {
      const a = coords[i];
      const b = coords[i + 1];

      const line = new LineString([a, b]);
      const feat = new Feature({ geometry: line });

      const distance = getLength(line);
      const fuel =
        steamFuelPerMeter !== undefined
          ? distance * steamFuelPerMeter
          : undefined;

      dist += distance;
      if (fuel !== undefined) {
        steamFuel += fuel;
      }

      feat.setStyle(lineStyle(line, distance, fuel, showDistance));
      linesSource.addFeature(feat);
    }

    setDistance(dist);
    setSteamingFuel(steamFuel);

    onChange({ distance: dist, steamingFuel: steamFuel });
  }, [pointsSource, linesSource, steamFuelPerMeter, showDistance, onChange]);

  const addPoint = useCallback(
    (coord: Coordinate) => {
      const pointIndex = pointsSource.getFeatures().length;
      const geometry = new Point(coord);

      const point = new Feature({
        geometry,
        draggable: true,
        pointIndex,
      });

      point.setStyle(pointStyle(zoom, pointIndex));

      pointsSource.addFeature(point);

      updateLinesRef.current();
      geometry.on("change", () => updateLinesRef.current());
    },
    [pointsSource, zoom],
  );

  useEffect(() => {
    updateLinesRef.current = updateLines;
  }, [updateLines]);

  useEffect(() => {
    addPointRef.current = addPoint;
  }, [addPoint]);

  useEffect(() => {
    if (initialPoint && pointsSource.getFeatures().length === 0) {
      addPointRef.current(fromLonLat(initialPoint.lon, initialPoint.lat));
    }
  }, [initialPoint, pointsSource]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    const click = (evt: MapBrowserEvent) => {
      if (evt.dragging) {
        return;
      }
      const feature = map.forEachFeatureAtPixel(evt.pixel, pixelFeature, {
        layerFilter: (layer) => !layer.get("disableHitDetection"),
      });
      if (feature) {
        return;
      }

      addPointRef.current(map.getCoordinateFromPixel(evt.pixel));
    };

    const translate = new Translate({
      filter: (feature) => feature.get("draggable") === true,
    });

    map.on("click", click);
    map.addInteraction(translate);
    return () => {
      map.un("click", click);
      map.removeInteraction(translate);
    };
  }, [map, selected]);

  useEffect(() => {
    if (selected) {
      pointsSource.forEachFeature((f) =>
        f.setStyle(pointStyle(zoom, f.get("pointIndex"))),
      );
    }
  }, [zoom, selected]);

  useEffect(() => {
    if (showDistance !== prevShowDistance.current) {
      updateLinesRef.current();
      prevShowDistance.current = showDistance;
    }
  }, [showDistance]);

  const totalFuel =
    haulFuelPerDay !== undefined
      ? (steamingFuel ?? 0) + (haulTime ?? 0) * (haulFuelPerDay / 24)
      : steamingFuel;

  const totalFuelPrice =
    totalFuel !== undefined && fuelPrice !== undefined
      ? totalFuel * fuelPrice
      : undefined;

  const totalCatchPrice =
    targetWeight !== undefined && speciesPrice !== undefined
      ? targetWeight * speciesPrice
      : undefined;

  const steamTime =
    steamSpeedMs !== undefined && steamSpeedMs > 0 && distance !== undefined
      ? distance / steamSpeedMs / 3600
      : undefined;

  const time =
    haulTime !== undefined || steamTime !== undefined
      ? (haulTime ?? 0) + (steamTime ?? 0)
      : undefined;

  const profit =
    totalFuelPrice !== undefined && totalCatchPrice !== undefined
      ? totalCatchPrice - totalFuelPrice
      : undefined;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr max-content 1fr",
        gap: 2,
      }}
    >
      <Typography sx={{ gridRow: 1, gridColumn: 1 }}>Distanse</Typography>
      {distance !== undefined && (
        <Typography sx={{ gridRow: 1, gridColumn: 2 }}>
          {metersOrNauticalMilesFormatter(distance, 0)}
        </Typography>
      )}

      <Typography sx={{ gridRow: 2, gridColumn: 1 }}>Drivstoff</Typography>
      {steamFuelPerMeter !== undefined && totalFuel !== undefined && (
        <Typography sx={{ gridRow: 2, gridColumn: 2 }}>
          {totalFuel.toFixed(0)} liter
        </Typography>
      )}
      {totalFuelPrice !== undefined && (
        <Typography sx={{ gridRow: 2, gridColumn: 3 }}>
          -{totalFuelPrice.toFixed(0)} kr
        </Typography>
      )}

      <Typography sx={{ gridRow: 3, gridColumn: 1 }}>Fangst</Typography>
      {targetWeight !== undefined && (
        <Typography sx={{ gridRow: 3, gridColumn: 2 }}>
          {kilosOrTonsFormatter(targetWeight, 0)}
        </Typography>
      )}
      {totalCatchPrice !== undefined && (
        <Typography sx={{ gridRow: 3, gridColumn: 3 }}>
          +{totalCatchPrice.toFixed(0)} kr
        </Typography>
      )}

      <Typography sx={{ gridRow: 4, gridColumn: 1 }}>Tid</Typography>
      {time !== undefined && (
        <Typography sx={{ gridRow: 4, gridColumn: "2 / 4" }}>
          {createDurationFromHours(time)}
        </Typography>
      )}

      <Typography sx={{ mt: 2, gridRow: 5, gridColumn: 1 }}>Total</Typography>
      {profit !== undefined && (
        <Typography
          sx={{
            mt: 2,
            gridRow: 5,
            gridColumn: 3,
            color: profit > 0 ? "green" : "red",
          }}
        >
          {profit > 0 ? "+" : ""}
          {profit.toFixed(0)} kr
        </Typography>
      )}

      {selected && (
        <>
          <VectorLayer source={pointsSource} zIndex={10} />
          <VectorLayer source={linesSource} zIndex={9} />
        </>
      )}
    </Box>
  );
};

const pointStyle = (zoom: number, index: number) =>
  new Style({
    image: new CircleStyle({
      fill: new Fill({ color: "white" }),
      stroke: new Stroke({
        color: index === 0 ? "#50C878" : "orange",
        width: zoom * 1.5,
      }),
      radius: zoom * 2,
    }),
  });

const lineStyle = (
  line: LineString,
  distance: number,
  fuel?: number,
  showDistance?: boolean,
) => {
  const [c1, c2] = line.getCoordinates();

  const dx = c2[0] - c1[0];
  const dy = c2[1] - c1[1];

  let angle = Math.atan2(dy, dx);

  if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
    angle += Math.PI;
  }

  return new Style({
    stroke: new Stroke({ color: "gray", width: 3, lineDash: [10, 10] }),
    text: showDistance
      ? new Text({
          text:
            fuel !== undefined
              ? `${metersOrNauticalMilesFormatter(distance)}\n${fuel.toFixed(0)} liter`
              : metersOrNauticalMilesFormatter(distance),
          placement: "point",
          textAlign: "center",
          rotation: -angle,
          rotateWithView: true,
          font: "14px Arial",
          fill: new Fill({
            color: "black",
          }),
          offsetY: -24,
        })
      : undefined,
  });
};

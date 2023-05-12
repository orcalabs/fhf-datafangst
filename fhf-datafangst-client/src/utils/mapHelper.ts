import { Map } from "ol";
import { fromLonLat, toLonLat } from "ol/proj";
import Draw, { createBox, DrawEvent } from "ol/interaction/Draw";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import GeoJSON from "ol/format/GeoJSON";
import Geometry from "ol/geom/Geometry";
import { AisVmsPosition, Haul } from "generated/openapi";
import { LineString, Point } from "ol/geom";
import ColorScale from "color-scales";
import {
  differenceMinutes,
  findHighestHaulCatchWeight,
  matrixSum,
  sumCatches,
} from "utils";
import theme from "app/theme";
import pinkVesselPin from "assets/icons/vessel-map-pink.svg";
import fishingLocationsGrid from "assets/geojson/fishing-locations-grid.json";
import shoreline from "assets/geojson/shoreline.json";

export const shorelineVector = new VectorSource({
  features: new GeoJSON({
    featureProjection: process.env.REACT_APP_EPSG as string,
    geometryName: "shoreline",
  }).readFeatures(shoreline),
});

export const fishingLocationAreas = fishingLocationsGrid.features
  .map((f) => f.properties.lokref)
  .sort((a, b) => a.localeCompare(b));

const fishingLocationFeatures = new GeoJSON({
  featureProjection: process.env.REACT_APP_EPSG as string,
  geometryName: "fishingLocations",
})
  .readFeatures(fishingLocationsGrid)
  .sort((a, b) => a.get("lokref").localeCompare(b.get("lokref")));

export interface TravelVector {
  vector: VectorSource<Geometry>;
  style: Style;
}

export const createColorScale = (min: number, max: number, opacity?: number) =>
  new ColorScale(
    min,
    max,
    ["#6A9DB2", "#1b8a5a", "#fbb021", "#f68838", "#ee3e32"],
    opacity ?? 0.6,
  );

export const generateGridBoxStyle = (
  areaCode: string,
  colorGrade: number,
  colorScale: ColorScale | string,
  selected?: boolean,
): Style => {
  const color =
    typeof colorScale === "string"
      ? colorScale
      : colorScale.getColor(colorGrade).toRGBAString();

  return selected
    ? new Style({
        fill: new Fill({ color: "#C3E0E5" }),
        stroke: new Stroke({
          color: color.replace(/[.0-9]+\)/, "1)"),
          width: 2,
        }),
        text: new Text({
          fill: new Fill({ color: "#387D90" }),
          text: areaCode,
        }),
      })
    : new Style({
        fill: new Fill({ color }),
        text: new Text({
          fill: new Fill({ color: "#387D90" }),
          text: areaCode,
        }),
      });
};

export const defaultGridBoxStyle = (areaCode: string): Style => {
  return new Style({
    fill: new Fill({
      color: [255, 255, 255, 0],
    }),
    text: new Text({ fill: new Fill({ color: "#387D90" }), text: areaCode }),
  });
};

export const generateHaulsVector = (hauls: Haul[] | undefined) => {
  if (!hauls?.length) {
    return;
  }

  const haulsVector = new VectorSource<Point>();
  const highestCatchSum = findHighestHaulCatchWeight(hauls);

  const colorScale = createColorScale(0, highestCatchSum, 1);

  for (let i = 0; i < hauls.length; i++) {
    const haul = hauls[i];
    const sum = sumCatches(haul.catches);
    const color = colorScale.getColor(sum);
    const haulFeature = new Feature({
      geometry: new Point(
        fromLonLat([haul.startLongitude, haul.startLatitude]),
      ),
      haulIdx: i,
      red: color.r,
      green: color.g,
      blue: color.b,
    });
    haulsVector.addFeature(haulFeature);
  }

  return haulsVector;
};

export const generateHaulsHeatmap = (hauls: Haul[] | undefined) => {
  if (!hauls?.length) {
    return;
  }

  const heatmapVector = new VectorSource();

  for (let i = 0; i < hauls.length; i++) {
    const haul = hauls[i];

    const haulFeature = new Feature({
      geometry: new Point(
        fromLonLat([haul.startLongitude, haul.startLatitude]),
      ),
      weight: sumCatches(haul.catches),
    });

    heatmapVector.addFeature(haulFeature);
  }

  return heatmapVector;
};

export const generateLocationsMatrix = (
  matrix: number[] | undefined,
  selectedFilters: number[],
  selectedGrids?: string[],
) => {
  if (!matrix) {
    return;
  }

  const width = fishingLocationAreas.length;
  const height = matrix.length / width;
  const weights: number[] = Array(width);

  let max = -Infinity;
  let min = Infinity;

  for (let x = 0; x < width; x++) {
    let sum = 0;
    if (selectedFilters.length)
      for (let i = 0; i < selectedFilters.length; i++) {
        const y = selectedFilters[i];
        sum += matrixSum(matrix, width, x, y, x, y);
      }
    else {
      sum += matrixSum(matrix, width, x, 0, x, height - 1);
    }
    if (sum > max) max = sum;
    if (sum < min) min = sum;
    weights[x] = sum;
  }

  // `ColorScale` cannot have equal min and max value
  if (min === max) {
    min--;
  }

  const colorScale = createColorScale(min, max);

  for (let i = 0; i < fishingLocationFeatures.length; i++) {
    const area = fishingLocationAreas[i];
    const feature = fishingLocationFeatures[i];
    const weight = weights[i];

    feature.setProperties({ weight });
    feature.setStyle(
      weight > 0
        ? generateGridBoxStyle(
            area,
            weight,
            colorScale,
            selectedGrids?.includes(area),
          )
        : defaultGridBoxStyle(area),
    );
  }

  return new VectorSource({ features: fishingLocationFeatures });
};

export const parseCapabilites = (capabilitesText: string) =>
  new WMTSCapabilities().read(capabilitesText);

export const changeIconSizes = (
  vector: VectorSource<Geometry> | undefined,
  size: number,
) => vector?.forEachFeature((f) => changeIconSizeFromFeature(f, size));

export const changeIconSizeFromFeature = (
  feature: Feature<Geometry>,
  size: number,
) => {
  const style = feature.getStyle() as Style;
  if (!style) return;

  const image = style.getImage();
  image.setScale(size);

  // Re-draw change on map
  feature.changed();
};

export interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const boxSelect = (map: Map, callback: (box: Box) => void) => {
  const source = new VectorSource({ wrapX: false });
  const geometryFunction = createBox();
  const draw = new Draw({
    source,
    geometryFunction,
    type: "Circle",
    freehand: true,
  });
  draw.on("drawend", (e: DrawEvent) => {
    e.stopPropagation();
    // `getCoordinates` exists on `Geometry`, trust me :)
    const coords = (e.feature.getGeometry() as any).getCoordinates()[0];
    if (coords?.length === 5) {
      const a = toLonLat(coords[1]);
      const b = toLonLat(coords[3]);
      const res = {
        x1: b[0],
        y1: b[1],
        x2: a[0],
        y2: a[1],
      };
      callback(res);
    }

    map.removeInteraction(draw);
  });
  map.addInteraction(draw);
};

const mainStyle = new Style({
  stroke: new Stroke({
    color: theme.palette.third.main,
    width: 2,
  }),
});

const secondStyle = new Style({
  stroke: new Stroke({
    color: theme.palette.grey[700],
    lineDash: [5],
    width: 2,
  }),
});

const trackVesselStyle = (pos: AisVmsPosition, zoom?: number): Style => {
  // Set max size for vessel icon
  let iconSize = zoom ? zoom * 0.018 : 2.7 * 0.018;
  if (iconSize > 0.06) {
    iconSize = 0.06;
  }
  return new Style({
    image: new Icon({
      rotation: ((pos.cog ?? 0) * Math.PI) / 180,
      opacity: 1,
      anchor: [0.5, 0.5],
      scale: iconSize,
      src: pinkVesselPin,
    }),
  });
};

const lineFeature = (line: LineString): Feature =>
  new Feature({
    geometry: line,
    name: "VesselLine",
  });

export const generateVesselTrackVector = (
  positions: AisVmsPosition[] | undefined,
  zoomLevel: number | undefined,
  haul: Haul | undefined,
): TravelVector[] => {
  const lineVectors = [{ vector: new VectorSource(), style: mainStyle }];

  if (!positions?.length) {
    return lineVectors;
  }

  let detailNumber = 0;
  let flag = false;
  let lineVector = lineVectors[0];
  let line = new LineString([]);

  // Draw dashed line from start of haul position to first AIS point if we're missing data
  if (
    haul &&
    differenceMinutes(
      new Date(positions[0].timestamp),
      new Date(haul.startTimestamp),
    ) > 5
  ) {
    const startLine = { vector: new VectorSource(), style: secondStyle };
    const line = new LineString([
      fromLonLat([haul.startLongitude, haul.startLatitude]),
      fromLonLat([positions[0].lon, positions[0].lat]),
    ]);

    startLine.vector.addFeature(lineFeature(line));
    // Use unshift because of drawing order (avoid line on top of vessel icon)
    lineVectors.unshift(startLine);
  }

  // Draw dashed line from end of AIS track to haul's stop position if we're missing data
  if (
    haul &&
    differenceMinutes(
      new Date(positions[positions.length - 1].timestamp),
      new Date(haul.stopTimestamp),
    )
  ) {
    const stopLine = { vector: new VectorSource(), style: secondStyle };
    const line = new LineString([
      fromLonLat([haul.stopLongitude, haul.stopLatitude]),
      fromLonLat([
        positions[positions.length - 1].lon,
        positions[positions.length - 1].lat,
      ]),
    ]);

    stopLine.vector.addFeature(lineFeature(line));
    // Use unshift because of drawing order (avoid line on top of vessel icon)
    lineVectors.unshift(stopLine);
  }

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];

    // Only draw vessels on line if we have a detailed point from backend
    if (pos.det) {
      // If we hit a vessel with `missingData === true`, we need to
      // create a new lineVector to visualize the missing data as a grey dashed line.
      // Subsequently, at the next vessel, we need to go back to the regular line.
      const p = new Feature({
        geometry: new Point(fromLonLat([pos.lon, pos.lat])),
        aisPosition: pos,
      });

      p.setStyle(trackVesselStyle(pos, zoomLevel));

      if (pos.det.missingData || flag) {
        line.appendCoordinate(fromLonLat([pos.lon, pos.lat]));
        lineVector.vector.addFeature(lineFeature(line));

        lineVector = {
          vector: new VectorSource(),
          style: pos.det.missingData ? secondStyle : mainStyle,
        };

        lineVectors.push(lineVector);
        line = new LineString([]);

        flag = pos.det.missingData;
      }

      // Dynamically limit number of vessels drawn on track, relative to zoom level
      // The math behind it is sort of hacky, but gives a nice output
      detailNumber++;

      // Make sure we draw a vessel on each end of a line and always start and stop symbols.
      if (
        zoomLevel &&
        lineVector.vector.getFeatures().length > 2 &&
        !(i === 0 || i === positions.length - 1)
      ) {
        if (Math.round(zoomLevel) === 1 && detailNumber % 5) {
          continue;
        } else if (Math.round(zoomLevel) === 2 && detailNumber % 4) {
          continue;
        } else if (Math.round(zoomLevel) === 3 && detailNumber % 3) {
          continue;
        } else if (Math.round(zoomLevel) === 4 && detailNumber % 2) {
          continue;
        } else if (Math.round(zoomLevel) === 5 && detailNumber % 1) {
          continue;
        }
      }

      lineVector.vector.addFeature(p);
    }
    line.appendCoordinate(fromLonLat([pos.lon, pos.lat]));
  }
  lineVector.vector.addFeature(lineFeature(line));

  return lineVectors;
};

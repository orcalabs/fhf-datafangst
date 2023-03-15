import { Map } from "ol";
import { fromLonLat, toLonLat } from "ol/proj";
import Draw, { createBox, DrawEvent } from "ol/interaction/Draw";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import GeoJSON from "ol/format/GeoJSON";
import Geometry from "ol/geom/Geometry";
import { AisPosition, Haul, HaulsGrid } from "generated/openapi";
import { LineString, Point } from "ol/geom";
import ColorScale from "color-scales";
import { findHighestHaulCatchWeight, sumHaulCatches } from "utils";
import { Track } from "models";
import theme from "app/theme";
import pinkVesselPin from "assets/icons/vessel-map-pink.svg";

export interface TravelVector {
  vector: VectorSource<Geometry>;
  style: Style;
}

export const getColorGrade = (colorGrade: number, maxGrade: number) => {
  const colorScale = new ColorScale(
    0,
    maxGrade,
    ["#66b2ab", "#1b8a5a", "#fbb021", "#f68838", "#ee3e32"],
    0.7,
  );

  return colorScale.getColor(colorGrade).toRGBAString();
};

export const generateGridBoxStyle = (
  areaCode: string,
  colorGrade: number,
  maxGrade: number,
): Style => {
  return new Style({
    fill: new Fill({ color: getColorGrade(colorGrade, maxGrade) }),
    // stroke: new Stroke({ color: "#387D90", width: 1 }),
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
    // stroke: new Stroke({ color: "#387D90", width: 1 }),
    text: new Text({ fill: new Fill({ color: "#387D90" }), text: areaCode }),
  });
};

export const selectedGridBoxStyle = (areaCode: string): Style => {
  return new Style({
    fill: new Fill({
      color: [255, 255, 255, 0.3],
    }),
    stroke: new Stroke({ color: "#387D90", width: 1 }),
    text: new Text({ fill: new Fill({ color: "#387D90" }), text: areaCode }),
  });
};

export const generateHaulsVector = (hauls: Haul[] | undefined) => {
  if (!hauls) {
    return;
  }

  const haulsVector = new VectorSource();
  const highestCatchSum = findHighestHaulCatchWeight(hauls);

  for (let i = 0; i < hauls.length; i++) {
    const haul = hauls[i];
    const sum = sumHaulCatches(haul.catches);
    const haulFeature = new Feature({
      geometry: new Point(
        fromLonLat([haul.startLongitude, haul.startLatitude]),
      ),
      haul,
    });
    haulFeature.setStyle(
      new Style({
        image: new Circle({
          radius: 2.5,
          fill: new Fill({
            color: getColorGrade(sum, highestCatchSum),
          }),
        }),
      }),
    );

    haulsVector.addFeature(haulFeature);
  }

  return haulsVector;
};

export const generateHaulsHeatmap = (hauls: Haul[] | undefined) => {
  if (!hauls) {
    return;
  }

  const heatmapVector = new VectorSource();

  for (let i = 0; i < hauls.length; i++) {
    const haul = hauls[i];

    const haulFeature = new Feature({
      geometry: new Point(
        fromLonLat([haul.startLongitude, haul.startLatitude]),
      ),
      weight: sumHaulCatches(haul.catches),
    });

    heatmapVector.addFeature(haulFeature);
  }

  return heatmapVector;
};

export const generateShorelineVector = (geoJsonObject: any) =>
  new VectorSource({
    features: new GeoJSON({
      featureProjection: process.env.REACT_APP_EPSG as string,
      geometryName: "shoreline",
    }).readFeatures(geoJsonObject),
  });

export const generateLocationsGrid = (
  geoJsonObject: any,
  haulsGrid?: HaulsGrid,
) => {
  if (!haulsGrid) {
    return;
  }
  const features = new GeoJSON({
    featureProjection: process.env.REACT_APP_EPSG as string,
    geometryName: "fishingLocations",
  }).readFeatures(geoJsonObject);

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const area = feature.get("lokref");

    if (haulsGrid.grid[area]) {
      const style = generateGridBoxStyle(
        area,
        haulsGrid.grid[area],
        haulsGrid.maxWeight,
      );
      feature.setStyle(style);
    } else {
      const style = defaultGridBoxStyle(area.toString());
      feature.setStyle(style);
    }
  }
  return new VectorSource({ features });
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

const trackVesselStyle = (pos: AisPosition, zoom?: number): Style => {
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

export const generateHaulTravelVector = (
  ais: Track | undefined,
  zoomLevel: number | undefined,
): TravelVector[] => {
  const positions = ais?.positions;
  const lineVectors = [{ vector: new VectorSource(), style: mainStyle }];

  if (!positions?.length) {
    return lineVectors;
  }

  let detailNumber = 0;
  let flag = false;
  let lineVector = lineVectors[0];
  let line = new LineString([]);

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

import { WKT } from "ol/format";
import { fromLonLat as _fromLonLat } from "ol/proj";
import {
  Circle,
  Fill,
  Icon,
  RegularShape,
  Stroke,
  Style,
  Text,
} from "ol/style";
import Feature from "ol/Feature";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Geometry from "ol/geom/Geometry";
import {
  AisVmsPosition,
  FishingFacility,
  Haul,
  TripHaul,
} from "generated/openapi";
import { LineString, Point } from "ol/geom";
import ColorScale from "color-scales";
import {
  differenceHours,
  findHighestHaulCatchWeight,
  matrixSum,
  sumCatches,
} from "utils";
import theme from "app/theme";
import pinkVesselPin from "assets/icons/vessel-map-pink.svg";
import fishingLocationsGrid from "assets/geojson/fishing-locations-grid.json";
import shoreline from "assets/geojson/shoreline.json";
import CircleStyle from "ol/style/Circle";
import darkPinkVesselPin from "assets/icons/vessel-map-dark-pink.svg";

export const fromLonLat = (lon: number, lat: number) => {
  if (lat > 90) {
    lat = 180 - lat;
    lon += 180;
  } else if (lat < -90) {
    lat = -180 - lat;
    lon += 180;
  }
  return _fromLonLat([lon, lat]);
};

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

const startStyle = (zoom?: number, zIndex = 10): Style => {
  // Set max size for start icon
  let iconSize = zoom ? zoom * 1.2 : 4.5;
  if (iconSize > 4.5) {
    iconSize = 4.5;
  }

  return new Style({
    image: new CircleStyle({
      fill: new Fill({ color: "white" }),
      stroke: new Stroke({ color: "#FF5F26", width: iconSize / 2.5 }),
      radius: iconSize,
    }),
    zIndex,
  });
};

const stopStyle = (zoom?: number, zIndex = 10): Style => {
  // Set max size for stop icon
  let iconSize = zoom ? zoom * 1.3 : 5.5;
  if (iconSize > 5.5) {
    iconSize = 5.5;
  }
  return new Style({
    image: new RegularShape({
      fill: new Fill({ color: "white" }),
      stroke: new Stroke({
        color: "#FF5F26",
        width: iconSize / 3.1,
        lineCap: "square",
        lineJoin: "miter",
      }),
      points: 4,
      radius: iconSize,
      angle: Math.PI / 4,
    }),
    zIndex,
  });
};

export const createColorScale = (min: number, max: number, opacity?: number) =>
  new ColorScale(
    min,
    max,
    ["#6A9DB2", "#1b8a5a", "#fbb021", "#f68838", "#ee3e32"],
    opacity ?? 0.6,
  );

export const generateGridBoxStyle = (
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
        fill: new Fill({ color: "rgba(195, 224, 229, 0.6)" }),
        stroke: new Stroke({
          color: color.replace(/[.0-9]+\)/, "1)"),
          width: 2,
        }),
        text: new Text({
          fill: new Fill({ color: "#387D90" }),
        }),
      })
    : new Style({
        fill: new Fill({ color }),
        text: new Text({
          fill: new Fill({ color: "#387D90" }),
        }),
      });
};

const defaultGridBoxStyle = new Style({
  fill: new Fill({
    color: [255, 255, 255, 0],
  }),
});

export const fishingFacilityStyle = (
  toolType: number,
  geometry?: Geometry,
  selected?: boolean,
) => {
  if (!geometry) {
    return;
  }

  let color = "";
  if (toolType === 2) {
    // Teine
    color = "#f0ba29";
  } else if (toolType === 3) {
    // Snurrevad
    color = "#8202c1";
  } else if (toolType === 4) {
    // Garn
    color = "#085382";
  } else if (toolType === 5) {
    // Line
    color = "#d72424";
  } else {
    color = "orange";
  }

  // Draw line with Circle at the start
  if (geometry.getType() === "LineString") {
    const geo = geometry as LineString;

    return [
      new Style({
        stroke: new Stroke({
          color,
          width: selected ? 3 : 2,
        }),
      }),
      new Style({
        geometry: new Point(geo.getFirstCoordinate()),
        image: new Circle({
          radius: selected ? 3.5 : 2.5,
          fill: new Fill({
            color,
          }),
        }),
      }),
    ];
    // Draw a single Circle
  } else {
    return new Style({
      image: new Circle({
        radius: selected ? 3.5 : 2.5,
        fill: new Fill({
          color,
        }),
      }),
    });
  }
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
      geometry: new Point(fromLonLat(haul.startLongitude, haul.startLatitude)),
      haulId: haul.haulId,
      red: color.r,
      green: color.g,
      blue: color.b,
    });
    haulsVector.addFeature(haulFeature);
  }

  return haulsVector;
};

export const generateFishingFacilitiesVector = (
  facilities?: FishingFacility[],
  selectedFacility?: FishingFacility,
) => {
  const vector = new VectorSource();

  if (!facilities?.length) {
    return vector;
  }
  const wkt = new WKT();

  for (let i = 0; i < facilities.length; i++) {
    const facility = facilities[i];
    const geometry = wkt.readGeometry(facility.geometryWkt, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });

    const feature = new Feature({
      geometry,
      fishingFacilityIdx: i,
      toolType: facility.toolType,
    });

    feature.setStyle(
      fishingFacilityStyle(
        facility.toolType,
        feature.getGeometry(),
        facility.toolId === selectedFacility?.toolId,
      ),
    );

    vector.addFeature(feature);
  }

  return vector;
};

export const generateLocationsMatrix = (
  matrix: number[] | undefined,
  selectedFilters: number[],
  selectedGrids: string[],
) => {
  if (!matrix) {
    return [];
  }

  const height = fishingLocationAreas.length;
  const width = matrix.length / height;
  const weights: number[] = Array(height);

  let max = 0;
  let min = 0;

  for (let y = 0; y < height; y++) {
    let sum = 0;
    if (selectedFilters.length)
      for (let i = 0; i < selectedFilters.length; i++) {
        const x = selectedFilters[i];
        if (x < width) {
          sum += matrixSum(matrix, width, x, y, x, y);
        }
      }
    else {
      sum += matrixSum(matrix, width, 0, y, width - 1, y);
    }
    if (sum > max) max = sum;
    if (sum < min) min = sum;
    weights[y] = sum;
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
        ? generateGridBoxStyle(weight, colorScale, selectedGrids.includes(area))
        : defaultGridBoxStyle,
    );
  }

  return fishingLocationFeatures;
};

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

const mainLineStyle = new Style({
  stroke: new Stroke({
    color: theme.palette.third.main,
    width: 2,
  }),
});

const dashedLineStyle = new Style({
  stroke: new Stroke({
    color: theme.palette.grey[700],
    lineDash: [5],
    width: 2,
  }),
});

const selectedLineStyle = new Style({
  stroke: new Stroke({
    color: theme.palette.third.dark,
    width: 3,
  }),
});

const selectedDashedLineStyle = new Style({
  stroke: new Stroke({
    color: theme.palette.third.dark,
    lineDash: [5],
    width: 3,
  }),
});

const trackVesselStyle = (
  pos: AisVmsPosition,
  zoom?: number,
  selected?: boolean,
): Style => {
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
      scale: selected ? iconSize * 1.3 : iconSize,
      src: selected ? darkPinkVesselPin : pinkVesselPin,
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
  showStartStop?: boolean,
  selected?: boolean,
): TravelVector[] => {
  const lineVectors = [
    {
      vector: new VectorSource(),
      style: selected ? selectedLineStyle : mainLineStyle,
    },
  ];

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
    differenceHours(
      new Date(positions[0].timestamp),
      new Date(haul.startTimestamp),
    ) > 1
  ) {
    const startLine = {
      vector: new VectorSource(),
      style: selected ? selectedDashedLineStyle : dashedLineStyle,
    };
    const line = new LineString([
      fromLonLat(haul.startLongitude, haul.startLatitude),
      fromLonLat(positions[0].lon, positions[0].lat),
    ]);

    startLine.vector.addFeature(lineFeature(line));
    // Use unshift because of drawing order (avoid line on top of vessel icon)
    lineVectors.unshift(startLine);
  }

  // Draw dashed line from end of AIS track to haul's stop position if we're missing data
  if (
    haul &&
    differenceHours(
      new Date(positions[positions.length - 1].timestamp),
      new Date(haul.stopTimestamp),
    )
  ) {
    const stopLine = {
      vector: new VectorSource(),
      style: selected ? selectedDashedLineStyle : dashedLineStyle,
    };
    const line = new LineString([
      fromLonLat(haul.stopLongitude, haul.stopLatitude),
      fromLonLat(
        positions[positions.length - 1].lon,
        positions[positions.length - 1].lat,
      ),
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
        geometry: new Point(fromLonLat(pos.lon, pos.lat)),
        aisPosition: pos,
      });

      p.setStyle(
        showStartStop && (i === 0 || i === positions.length - 1)
          ? i === 0
            ? startStyle(zoomLevel)
            : stopStyle(zoomLevel)
          : trackVesselStyle(pos, zoomLevel, selected),
      );

      if (pos.det.missingData || flag) {
        line.appendCoordinate(fromLonLat(pos.lon, pos.lat));
        lineVector.vector.addFeature(lineFeature(line));

        lineVector = {
          vector: new VectorSource(),
          style:
            pos.det.missingData && selected
              ? selectedDashedLineStyle
              : pos.det.missingData
                ? dashedLineStyle
                : selected
                  ? selectedLineStyle
                  : mainLineStyle,
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
    line.appendCoordinate(fromLonLat(pos.lon, pos.lat));
  }
  lineVector.vector.addFeature(lineFeature(line));

  return lineVectors;
};

export const tripHaulStyle = (
  zoom?: number,
  selected?: boolean,
  hovered?: boolean,
) => {
  // Set max size for start icon
  let size = zoom ? zoom * 1.2 : 5;
  if (size > 5) {
    size = 5;
  }
  return new Style({
    image: new CircleStyle({
      fill: new Fill({
        color:
          hovered ?? selected
            ? theme.palette.fourth.dark
            : theme.palette.fourth.main,
      }),
      stroke: new Stroke({ color: "white", width: size / 3 }),
      radius: selected ? size * 1.3 : size,
    }),
    zIndex: 10,
  });
};

/* Generates map markers for Hauls in a Trip */
export const generateTripHaulsVector = (
  hauls: (Haul | TripHaul)[],
  zoomLevel: number | undefined,
  selectedTripHaul?: Haul,
) => {
  if (!hauls.length) {
    return;
  }

  const haulsVector = new VectorSource<Point>();

  for (let i = 0; i < hauls.length; i++) {
    const haul = hauls[i];
    const isSelected = haul.haulId === selectedTripHaul?.haulId;
    const haulFeature = new Feature({
      geometry: new Point(fromLonLat(haul.startLongitude, haul.startLatitude)),
      haul,
    });
    haulFeature.setStyle(tripHaulStyle(zoomLevel, isSelected));
    haulsVector.addFeature(haulFeature);
  }

  return haulsVector;
};

import { VectorLayer } from "components";
import locations from "assets/geojson/fishing-locations-grid.json";
import { generateColormapFromHauls, generateLocationsGrid } from "utils";
import { selectHauls, useAppSelector } from "store";

export const LocationsGrid = () => {
  const hauls = useAppSelector(selectHauls);

  const colorMap = generateColormapFromHauls(hauls);

  const grid = generateLocationsGrid(locations, colorMap);

  return <VectorLayer source={grid} zIndex={1} />;
};

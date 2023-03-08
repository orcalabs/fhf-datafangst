import { VectorLayer } from "components";
import locations from "assets/geojson/fishing-locations-grid.json";
import { generateColormapFromHauls, generateLocationsGrid } from "utils";
import { selectFilteredHauls, useAppSelector } from "store";

export const LocationsGrid = () => {
  const hauls = useAppSelector(selectFilteredHauls);

  const colorMap = generateColormapFromHauls(hauls);

  const grid = generateLocationsGrid(locations, colorMap);

  return <VectorLayer source={grid} zIndex={1} />;
};

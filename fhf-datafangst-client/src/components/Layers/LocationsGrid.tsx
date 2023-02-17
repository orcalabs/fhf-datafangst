import { VectorLayer } from "components";
import locations from "assets/geojson/fishing-locations-grid.json";
import { generateLocationsGrid } from "utils";

export const LocationsGrid = () => {
  const shorelineVector = generateLocationsGrid(locations);

  return <VectorLayer source={shorelineVector} zIndex={1} />;
};

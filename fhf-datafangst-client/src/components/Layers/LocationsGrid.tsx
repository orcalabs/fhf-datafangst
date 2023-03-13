import { VectorLayer } from "components";
import locations from "assets/geojson/fishing-locations-grid.json";
import { generateLocationsGrid } from "utils";
import { selectHaulsGrid, useAppSelector } from "store";
import { Geometry } from "ol/geom";
import { useEffect, useState } from "react";
import VectorSource from "ol/source/Vector";

export const LocationsGrid = () => {
  const haulsGrid = useAppSelector(selectHaulsGrid);
  const [gridVector, setGridVector] = useState<VectorSource<Geometry>>();

  useEffect(() => {
    const grid = generateLocationsGrid(locations, haulsGrid);
    setGridVector(grid);
  }, [haulsGrid]);

  return <VectorLayer source={gridVector} zIndex={1} />;
};

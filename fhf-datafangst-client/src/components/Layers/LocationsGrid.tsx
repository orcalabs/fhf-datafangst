import { VectorLayer } from "components";
import { Geometry } from "ol/geom";
import { useEffect, useState } from "react";
import VectorSource from "ol/source/Vector";
import { generateLocationsMatrix } from "utils";
import {
  selectHaulsFilterSelectionIndexes,
  selectLocationsMatrix,
  selectSelectedGridsString,
  useAppSelector,
} from "store";

export const LocationsGrid = () => {
  const matrix = useAppSelector(selectLocationsMatrix);
  const selectedFilters = useAppSelector(selectHaulsFilterSelectionIndexes);
  const selectedGrids = useAppSelector(selectSelectedGridsString);

  const [gridVector, setGridVector] = useState<VectorSource<Geometry>>();

  useEffect(
    () =>
      setGridVector(
        generateLocationsMatrix(matrix, selectedFilters, selectedGrids),
      ),
    [matrix, selectedFilters, selectedGrids],
  );

  return <VectorLayer source={gridVector} zIndex={1} />;
};

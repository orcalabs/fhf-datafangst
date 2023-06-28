import { VectorLayer } from "components";
import { Geometry } from "ol/geom";
import { useEffect, useState } from "react";
import VectorSource from "ol/source/Vector";
import { generateLocationsMatrix } from "utils";
import {
  selectHaulsMatrixActiveFilterSelectedIndexes,
  selectLocationsMatrix,
  selectSelectedGridsString,
  selectSelectedOrCurrentTrip,
  useAppSelector,
} from "store";

export const LocationsGrid = () => {
  const matrix = useAppSelector(selectLocationsMatrix);
  const selectedFilters = useAppSelector(
    selectHaulsMatrixActiveFilterSelectedIndexes,
  );
  const selectedTrip = useAppSelector(selectSelectedOrCurrentTrip);
  const selectedGrids = useAppSelector(selectSelectedGridsString);

  const [gridVector, setGridVector] = useState<VectorSource<Geometry>>();

  useEffect(() => {
    if (matrix) {
      setGridVector(
        generateLocationsMatrix(matrix, selectedFilters, selectedGrids),
      );
    }
  }, [matrix, selectedFilters]);

  return selectedTrip ? <></> : <VectorLayer source={gridVector} zIndex={1} />;
};

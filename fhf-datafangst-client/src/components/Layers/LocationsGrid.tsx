import { VectorLayer } from "components";
import { Geometry } from "ol/geom";
import { useEffect, useState } from "react";
import VectorSource from "ol/source/Vector";
import { generateLocationsMatrix } from "utils";
import {
  selectHaulsMatrixActiveFilterSelectedIndexes,
  selectLocationsMatrix,
  selectSelectedTrip,
  useAppSelector,
} from "store";

export const LocationsGrid = () => {
  const matrix = useAppSelector(selectLocationsMatrix);
  const selectedFilters = useAppSelector(
    selectHaulsMatrixActiveFilterSelectedIndexes,
  );
  const selectedTrip = useAppSelector(selectSelectedTrip);

  const [gridVector, setGridVector] = useState<VectorSource<Geometry>>();

  useEffect(() => {
    if (matrix) {
      setGridVector(generateLocationsMatrix(matrix, selectedFilters));
    }
  }, [matrix, selectedFilters]);

  return selectedTrip ? <></> : <VectorLayer source={gridVector} zIndex={1} />;
};

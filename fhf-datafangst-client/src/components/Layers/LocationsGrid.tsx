import { VectorLayer } from "components";
import { Geometry } from "ol/geom";
import { useEffect, useState } from "react";
import VectorSource from "ol/source/Vector";
import { generateLocationsMatrix } from "utils";
import {
  selectHaulsMatrixActiveFilterSelectedIndexes,
  selectHaulLocationsMatrix,
  selectSelectedGridsString,
  selectSelectedOrCurrentTrip,
  useAppSelector,
  selectMatrixToggle,
  MatrixToggle,
  selectLandingLocationsMatrix,
  selectLandingsMatrixActiveFilterSelectedIndexes,
} from "store";

export const LocationsGrid = () => {
  const matrixToggle = useAppSelector(selectMatrixToggle);

  const [matrix, selectedFilters] =
    matrixToggle === MatrixToggle.Haul
      ? [
          useAppSelector(selectHaulLocationsMatrix),
          useAppSelector(selectHaulsMatrixActiveFilterSelectedIndexes),
        ]
      : [
          useAppSelector(selectLandingLocationsMatrix),
          useAppSelector(selectLandingsMatrixActiveFilterSelectedIndexes),
        ];

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

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

  const [gridVector, _] = useState<VectorSource<Geometry>>(new VectorSource());

  useEffect(() => {
    if (matrix) {
      gridVector?.clear();
      const features = generateLocationsMatrix(
        matrix,
        selectedFilters,
        selectedGrids,
      );
      gridVector?.addFeatures(features);
    }
  }, [matrix, selectedFilters]);

  return selectedTrip ? <></> : <VectorLayer source={gridVector} zIndex={1} />;
};

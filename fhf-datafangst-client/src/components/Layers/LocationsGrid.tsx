import { VectorLayer } from "components";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { useEffect, useState } from "react";
import {
  MatrixToggle,
  selectHaulLocationsMatrix,
  selectHaulsMatrixActiveFilterSelectedIndexes,
  selectLandingLocationsMatrix,
  selectLandingsMatrixActiveFilterSelectedIndexes,
  selectMatrixToggle,
  selectSelectedGridsString,
  selectSelectedOrCurrentTrip,
  useAppSelector,
} from "store";
import { generateLocationsMatrix } from "utils";

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

  const [gridVector, _] = useState<VectorSource<Feature<Geometry>>>(
    new VectorSource(),
  );

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

import type { Feature } from "ol";
import type { Geometry } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { useEffect, useState } from "react";
import { VectorLayer } from "~/components";
import { MatrixTab, useMatrixTab } from "~/hooks";
import {
  selectHaulLocationsMatrix,
  selectHaulsMatrixActiveFilterSelectedIndexes,
  selectLandingLocationsMatrix,
  selectLandingsMatrixActiveFilterSelectedIndexes,
  selectSelectedGridsString,
  useAppSelector,
} from "~/store";
import { generateLocationsMatrix } from "~/utils";

export const LocationsGrid = () => {
  const [matrixTab, __] = useMatrixTab();

  const [matrix, selectedFilters] =
    matrixTab === MatrixTab.Ers
      ? [
          useAppSelector(selectHaulLocationsMatrix),
          useAppSelector(selectHaulsMatrixActiveFilterSelectedIndexes),
        ]
      : [
          useAppSelector(selectLandingLocationsMatrix),
          useAppSelector(selectLandingsMatrixActiveFilterSelectedIndexes),
        ];

  const selectedGrids = useAppSelector(selectSelectedGridsString);

  const [gridVector, _] = useState<VectorSource<Feature<Geometry>>>(
    new VectorSource(),
  );

  useEffect(() => {
    gridVector.clear();
    if (matrix) {
      const features = generateLocationsMatrix(
        matrix,
        selectedFilters,
        selectedGrids,
      );
      gridVector.addFeatures(features);
    }
  }, [matrix, selectedFilters]);

  return <VectorLayer source={gridVector} zIndex={1} />;
};

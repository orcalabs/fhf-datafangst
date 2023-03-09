import { FC } from "react";
import { generateHaulsVector } from "utils";
import { VectorLayer } from "components";
import { Haul } from "generated/openapi";
import { selectHaulsByArea, selectSelectedGrids, useAppSelector } from "store";

export const HaulsLayer: FC = () => {
  const haulsByArea = useAppSelector(selectHaulsByArea);
  const selectedAreas = useAppSelector(selectSelectedGrids);
  const hauls = () => {
    const haulsArray: Haul[] = [];
    for (const [key, value] of Object.entries(haulsByArea)) {
      for (const area of selectedAreas) {
        if (key === area.get("lokref")) {
          haulsArray.push(...value);
        }
      }
    }
    return haulsArray;
  };

  const haulsVector = generateHaulsVector(hauls());

  return (
    <>
      <VectorLayer source={haulsVector} zIndex={5} />
    </>
  );
};

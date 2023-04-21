import { FC, useEffect, useState } from "react";
import { generateHaulsVector } from "utils";
import { VectorLayer } from "components";
import { Haul } from "generated/openapi";
import { selectHaulsByArea, selectSelectedGrids, useAppSelector } from "store";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";

export const HaulsLayer: FC = () => {
  const [haulsVector, setHaulsVector] = useState<VectorSource<Geometry>>();
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

  useEffect(() => {
    // Prevent removing previous drawing when new hauls are loaded
    if (Object.entries(haulsByArea).length) {
      const vec = generateHaulsVector(hauls());
      setHaulsVector(vec);
    }

    if (!selectedAreas.length) {
      setHaulsVector(undefined);
    }
  }, [haulsByArea]);

  return (
    <>
      <VectorLayer source={haulsVector} zIndex={5} />
    </>
  );
};

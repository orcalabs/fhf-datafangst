import { VectorLayer } from "components";
import { Geometry } from "ol/geom";
import { useEffect, useState } from "react";
import VectorSource from "ol/source/Vector";
import { selectFishingFacilities, useAppSelector } from "store";
import { generateFishingFacilitiesVector } from "utils";

export const FishingFacilitiesLayer = () => {
  const fishingFacilities = useAppSelector(selectFishingFacilities);

  const [vector, setVector] = useState<VectorSource<Geometry>>();

  useEffect(() => {
    if (fishingFacilities) {
      const vector = generateFishingFacilitiesVector(fishingFacilities);
      setVector(vector);
    }
  }, [fishingFacilities]);

  return <VectorLayer source={vector} zIndex={2} />;
};

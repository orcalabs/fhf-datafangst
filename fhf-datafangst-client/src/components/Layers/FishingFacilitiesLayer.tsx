import { VectorLayer } from "components";
import { Geometry } from "ol/geom";
import { useEffect, useState } from "react";
import VectorSource from "ol/source/Vector";
import {
  selectFishingFacilities,
  selectSelectedFishingFacility,
  useAppSelector,
} from "store";
import { generateFishingFacilitiesVector } from "utils";

export const FishingFacilitiesLayer = () => {
  const fishingFacilities = useAppSelector(selectFishingFacilities);
  const selectedFishingFacility = useAppSelector(selectSelectedFishingFacility);
  const [vector, setVector] = useState<VectorSource<Geometry>>();

  useEffect(() => {
    if (fishingFacilities) {
      const vector = generateFishingFacilitiesVector(
        fishingFacilities,
        selectedFishingFacility,
      );
      setVector(vector);
    }
  }, [fishingFacilities, selectedFishingFacility]);

  return <VectorLayer source={vector} zIndex={2} />;
};

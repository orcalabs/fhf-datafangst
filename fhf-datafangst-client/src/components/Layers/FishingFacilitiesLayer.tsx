import type { Feature } from "ol";
import type { Geometry } from "ol/geom";
import type VectorSource from "ol/source/Vector";
import { useEffect, useState } from "react";
import { VectorLayer } from "~/components";
import {
  selectFishingFacilities,
  selectSelectedFishingFacility,
  useAppSelector,
} from "~/store";
import { generateFishingFacilitiesVector } from "~/utils";

export const FishingFacilitiesLayer = () => {
  const fishingFacilities = useAppSelector(selectFishingFacilities);
  const selectedFishingFacility = useAppSelector(selectSelectedFishingFacility);
  const [vector, setVector] = useState<VectorSource<Feature<Geometry>>>();

  useEffect(() => {
    const vector = generateFishingFacilitiesVector(
      fishingFacilities,
      selectedFishingFacility,
    );
    setVector(vector);
  }, [fishingFacilities, selectedFishingFacility]);

  return <VectorLayer source={vector} zIndex={2} name="gearsLayer" />;
};

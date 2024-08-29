import { VectorLayer } from "components";
import { Feature } from "ol";
import { Geometry } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { useEffect, useState } from "react";
import {
  selectFishingFacilities,
  selectSelectedFishingFacility,
  useAppSelector,
} from "store";
import { generateFishingFacilitiesVector } from "utils";

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

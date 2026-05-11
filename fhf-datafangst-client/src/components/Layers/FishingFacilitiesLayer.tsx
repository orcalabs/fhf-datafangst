import { useMemo } from "react";
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

  const vector = useMemo(
    () =>
      generateFishingFacilitiesVector(
        fishingFacilities,
        selectedFishingFacility,
      ),
    [fishingFacilities, selectedFishingFacility],
  );

  return <VectorLayer source={vector} zIndex={2} name="gearsLayer" />;
};

import type { FishingFacilitiesArgs } from "~/api";
import type { FishingFacility } from "~/generated/openapi";

export interface FishingFacilityState {
  fishingFacilities?: FishingFacility[];
  fishingFacilitiesLoading: boolean;
  fishingFacilitiesSearch?: FishingFacilitiesArgs;
  selectedFishingFacility?: FishingFacility;
}

export const initialFishingFacilitiesState: FishingFacilityState = {
  fishingFacilities: undefined,
  fishingFacilitiesLoading: false,
  fishingFacilitiesSearch: undefined,
  selectedFishingFacility: undefined,
};

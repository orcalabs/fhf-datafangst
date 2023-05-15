import { FishingFacilitiesArgs } from "api";
import { FishingFacility } from "generated/openapi";

export interface FishingFacilityState {
  fishingFacilities?: FishingFacility[];
  fishingFacilitiesLoading: boolean;
  fishingFacilitiesSearch?: FishingFacilitiesArgs;
}

export const initialFishingFacilitiesState: FishingFacilityState = {
  fishingFacilities: undefined,
  fishingFacilitiesLoading: false,
  fishingFacilitiesSearch: undefined,
};

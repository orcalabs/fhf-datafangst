import { FishingFacility } from "generated/openapi";

export interface FishingFacilityState {
  fishingFacilities?: FishingFacility[];
  fishingFacilitiesLoading: boolean;
}

export const initialFishingFacilitiesState: FishingFacilityState = {
  fishingFacilities: undefined,
  fishingFacilitiesLoading: false,
};

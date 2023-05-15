import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { getFishingFacilities, setFishingFacilitiesSearch } from "./actions";
import { AppState } from "store/state";

export const fishingFacilityBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getFishingFacilities.pending, (state, _) => {
      state.fishingFacilitiesLoading = true;
      state.fishingFacilities = undefined;
    })
    .addCase(getFishingFacilities.fulfilled, (state, action) => {
      state.fishingFacilitiesLoading = false;
      state.fishingFacilities = action.payload;
    })
    .addCase(getFishingFacilities.rejected, (state, _) => {
      state.fishingFacilitiesLoading = false;
    })
    .addCase(setFishingFacilitiesSearch, (state, action) => {
      state.fishingFacilitiesSearch = action.payload;
      (action as any).asyncDispatch(getFishingFacilities(action.payload));
    });

import { ActionReducerMapBuilder, current } from "@reduxjs/toolkit";
import {
  getFishingFacilities,
  paginateFishingFacilitiesSearch,
  setFishingFacilitiesSearch,
  setSelectedFishingFacility,
} from "./actions";
import { AppState } from "store/state";
import { FishingFacilitiesArgs } from "api";
import { FishingFacility } from "generated/openapi";

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
    .addCase(setSelectedFishingFacility, (state, action) => {
      const gear =
        typeof action.payload === "number"
          ? state.fishingFacilities?.[action.payload]
          : (action.payload as FishingFacility);
      state.selectedFishingFacility = gear;
    })
    .addCase(setFishingFacilitiesSearch, (state, action) => {
      state.fishingFacilitiesSearch = action.payload;
      state.fishingFacilitiesSearch.accessToken = state.user?.access_token;
      (action as any).asyncDispatch(getFishingFacilities(action.payload));
    })
    .addCase(paginateFishingFacilitiesSearch, (state, action) => {
      state.fishingFacilitiesSearch!.offset = action.payload.offset;
      state.fishingFacilitiesSearch!.limit = action.payload.limit;

      (action as any).asyncDispatch(
        getFishingFacilities(
          current(state.fishingFacilitiesSearch) as FishingFacilitiesArgs,
        ),
      );
    });

import { ActionReducerMapBuilder, current } from "@reduxjs/toolkit";
import { FishingFacilitiesArgs } from "api";
import { FishingFacility } from "generated/openapi";
import { emptyState } from "store";
import { AppState } from "store/state";
import {
  getFishingFacilities,
  paginateFishingFacilitiesSearch,
  setFishingFacilitiesSearch,
  setSelectedFishingFacility,
} from "./actions";

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
      const newSearch = action.payload;
      newSearch.accessToken = state.authUser?.access_token;
      (action as any).asyncDispatch(getFishingFacilities(action.payload));

      return {
        ...state,
        ...emptyState,
        fishingFacilitiesSearch: newSearch,
      };
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

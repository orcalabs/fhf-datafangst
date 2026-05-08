import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { FishingFacilitiesArgs } from "~/api";
import * as Api from "~/api";
import type { FishingFacility } from "~/generated/openapi";

export const getFishingFacilities = createAsyncThunk(
  "fishingFacility/getFishingFacilities",
  Api.getFishingFacilities,
);

export const setSelectedFishingFacility = createAction<
  FishingFacility | number | undefined
>("fishingFacility/setSelectedFishingFacility");

export const setFishingFacilitiesSearch = createAction<FishingFacilitiesArgs>(
  "fishingFacility/setFishingFacilitiesSearch",
);

export const paginateFishingFacilitiesSearch = createAction<{
  offset: number;
  limit: number;
}>("fishingFacility/paginateFishingFacilitiesSearch");

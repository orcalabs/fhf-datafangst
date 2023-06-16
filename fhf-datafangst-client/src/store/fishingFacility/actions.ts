import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { FishingFacilitiesArgs } from "api";
import { FishingFacility } from "generated/openapi";

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

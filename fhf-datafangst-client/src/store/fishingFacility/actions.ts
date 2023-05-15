import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { FishingFacilitiesArgs } from "api";

export const getFishingFacilities = createAsyncThunk(
  "fishingFacility/getFishingFacilities",
  Api.getFishingFacilities,
);

export const setFishingFacilitiesSearch = createAction<FishingFacilitiesArgs>(
  "fishingFacility/setFishingFacilitiesSearch",
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getFishingFacilities = createAsyncThunk(
  "fishingFacility/getFishingFacilities",
  Api.getFishingFacilities,
);

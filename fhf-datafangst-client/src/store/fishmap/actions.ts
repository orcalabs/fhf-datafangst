import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Feature, Map } from "ol";
import * as Api from "api";

export const initializeMap = createAction<Map>("fishmap/initializeMap");

export const toggleSelectedArea = createAction<Feature>(
  "fishmap/toggleSelectedArea",
);

export const getAreaTraffic = createAsyncThunk(
  "fishmap/getAreaTraffic",
  Api.getAisVmsArea,
);

export const setAreaDrawActive = createAction<boolean>(
  "fishmap/setAreaDrawActive",
);

export const clearAreaDrawing = createAction("fishmap/clearAreaDrawing");

import { createAction } from "@reduxjs/toolkit";
import { Feature, Map } from "ol";
import { ViewMode } from "store";

export const initializeMap = createAction<Map>("fishmap/initializeMap");

export const toggleSelectedArea = createAction<Feature>(
  "fishmap/toggleSelectedArea",
);

export const setViewMode = createAction<ViewMode>("base/setViewMode");

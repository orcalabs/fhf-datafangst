import { createAction } from "@reduxjs/toolkit";
import { Feature, Map } from "ol";

export const initializeMap = createAction<Map>("fishmap/initializeMap");

export const toggleSelectedArea = createAction<Feature>(
  "fishmap/toggleSelectedArea",
);

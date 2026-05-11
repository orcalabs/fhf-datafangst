import { createAction } from "@reduxjs/toolkit";
import type { Feature } from "ol";

export const toggleSelectedArea = createAction<Feature>(
  "grid/toggleSelectedArea",
);

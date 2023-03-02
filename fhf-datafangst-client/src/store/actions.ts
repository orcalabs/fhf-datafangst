import { createAction } from "@reduxjs/toolkit";
import { ViewMode } from "store";

export const setError = createAction<boolean>("base/setError");
export const resetState = createAction("base/resetState");
export const setViewMode = createAction<ViewMode>("base/setViewMode");

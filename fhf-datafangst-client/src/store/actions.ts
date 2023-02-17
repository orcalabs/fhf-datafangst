import { createAction } from "@reduxjs/toolkit";

export const setError = createAction<boolean>("base/setError");
export const resetState = createAction("base/resetState");

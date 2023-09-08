import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { MatrixToggle, MenuViewState } from "store";
import * as Api from "api";
import { User } from "oidc-react";

export const setError = createAction<boolean>("base/setError");

export const getBwProfile = createAsyncThunk(
  "base/getBwProfile",
  Api.getBwProfile,
);

export const resetState = createAction("base/resetState");

export const resetTrackState = createAction("base/resetTrackState");

export const checkLoggedIn = createAction<User>("base/checkLoggedIn");

export const setViewState = createAction<MenuViewState>("base/viewState");

export const setMatrixToggle = createAction<MatrixToggle>(
  "base/setMatrixToggle",
);

export const setTripFiltersOpen = createAction<boolean>(
  "base/setTripFiltersOpen",
);

export const setTripDetailsOpen = createAction<boolean>(
  "base/setTripDetailsOpen",
);

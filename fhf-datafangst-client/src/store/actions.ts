import { createAction, createAsyncThunk, GetThunkAPI } from "@reduxjs/toolkit";
import * as Api from "api";
import { User } from "oidc-react";
import { AppState, MatrixToggle, MenuViewState } from "./state";

export const bwTokenRequired = <T>(
  _: T,
  { getState }: Pick<GetThunkAPI<{ state: AppState }>, "getState" | "extra">,
): boolean => !!getState().authUser?.access_token;

export const setError = createAction<boolean>("base/setError");

export const getBwUser = createAsyncThunk("base/getBwUser", Api.getBwUser);

export const resetState = createAction("base/resetState");

export const resetTrackState = createAction("base/resetTrackState");

export const checkLoggedIn = createAction<User>("base/checkLoggedIn");

export const setViewState = createAction<MenuViewState | undefined>(
  "base/viewState",
);

export const setMatrixToggle = createAction<MatrixToggle>(
  "base/setMatrixToggle",
);

export const setTripFiltersOpen = createAction<boolean>(
  "base/setTripFiltersOpen",
);

export const setTripDetailsOpen = createAction<boolean>(
  "base/setTripDetailsOpen",
);

export const setVesselSettingsOpen = createAction<boolean>(
  "base/setVesselSettingsOpen",
);

import { createAction, createAsyncThunk, GetThunkAPI } from "@reduxjs/toolkit";
import * as Api from "api";
import { AppPage } from "containers/App/App";
import { User } from "oidc-react";
import { AppState } from "./state";

export const bwTokenRequired = <T>(
  _: T,
  { getState }: Pick<GetThunkAPI<{ state: AppState }>, "getState" | "extra">,
): boolean => !!getState().authUser?.access_token;

export const setError = createAction<boolean>("base/setError");

export const getBwUser = createAsyncThunk("base/getBwUser", Api.getBwUser);

export const resetState = createAction("base/resetState");

export const resetTrackState = createAction("base/resetTrackState");

export const checkLoggedIn = createAction<User>("base/checkLoggedIn");

export const setAppPage = createAction<AppPage>("base/setAppPage");

export const setTripFiltersOpen = createAction<boolean>(
  "base/setTripFiltersOpen",
);

export const setTripDetailsOpen = createAction<boolean>(
  "base/setTripDetailsOpen",
);

import type { GetThunkAPI } from "@reduxjs/toolkit";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "oidc-react";
import * as Api from "~/api";
import type { AppState } from "./state";

export const authTokenRequired = <T>(
  _: T,
  { getState }: Pick<GetThunkAPI<{ state: AppState }>, "getState" | "extra">,
): boolean => !!getState().authUser?.access_token;

export const setError = createAction<boolean>("base/setError");

export const getBwUser = createAsyncThunk("base/getBwUser", Api.getBwUser);

export const resetState = createAction("base/resetState");

export const checkLoggedIn = createAction<User>("base/checkLoggedIn");

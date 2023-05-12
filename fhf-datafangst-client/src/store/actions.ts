import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { MenuViewState } from "store";
import * as Api from "api";
import { User } from "oidc-react";

export const setError = createAction<boolean>("base/setError");

export const getUserProfile = createAsyncThunk(
  "base/getUserProfile",
  Api.getUserProfile,
);

export const resetState = createAction("base/resetState");

export const resetTrackState = createAction("base/resetTrackState");

export const checkLoggedIn = createAction<User>("base/checkLoggedIn");

export const setViewState = createAction<MenuViewState>("base/viewState");

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ViewMode } from "store";
import * as Api from "api";
import {
  login as _login,
  logout as _logout,
  checkLoggedIn as _checkLoggedIn,
} from "app/auth";

export const setError = createAction<boolean>("base/setError");

export const getUserProfile = createAsyncThunk(
  "base/getUserProfile",
  Api.getUserProfile,
);

export const resetState = createAction("base/resetState");

export const resetTrackState = createAction("base/resetTrackState");

export const setViewMode = createAction<ViewMode>("base/setViewMode");

export const login = createAsyncThunk("base/login", _login);

export const logout = createAsyncThunk("base/logout", _logout);

export const checkLoggedIn = createAsyncThunk(
  "base/checkLoggedIn",
  _checkLoggedIn,
);

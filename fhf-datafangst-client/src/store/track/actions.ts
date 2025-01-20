import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { Haul } from "generated/openapi";

export const getTrack = createAsyncThunk("track/getTrack", Api.getTrack);
export const getTrackWithoutLoading = createAsyncThunk(
  "track/getTrackWithoutLoading",
  Api.getTrack,
);
export const getHaulTrack = createAction<Haul | undefined>(
  "track/getHaulTrack",
);

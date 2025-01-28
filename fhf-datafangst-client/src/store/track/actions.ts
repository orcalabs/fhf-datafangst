import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { Haul } from "generated/openapi";

export const getTrack = createAsyncThunk("track/getTrack", Api.getTrack);

export const getHaulTrack = createAction<Haul | undefined>(
  "track/getHaulTrack",
);

export const getCurrentPositions = createAsyncThunk(
  "ais/getCurrentPositions",
  Api.getCurrentPositions,
);

export const getCurrentTripTrack = createAsyncThunk(
  "ais/getCurrentTripTrack",
  Api.getCurrentTripTrack,
);

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { Trip } from "generated/openapi";

export const getHaulTrip = createAsyncThunk(
  "trip/getHaulTrip",
  Api.getTripFromHaul,
);

export const setSelectedTrip = createAction<Trip | undefined>(
  "trip/setSelectedTrip",
);

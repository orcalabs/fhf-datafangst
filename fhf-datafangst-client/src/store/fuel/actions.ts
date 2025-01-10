import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getFuelMeasurements = createAsyncThunk(
  "fuel/getFuelMeasurements",
  Api.getFuelMeasurements,
);

export const createFuelMeasurement = createAsyncThunk(
  "fuel/createFuelMeasurement",
  Api.createFuelMeasurement,
);

export const updateFuelMeasurement = createAsyncThunk(
  "fuel/updateFuelMeasurement",
  Api.updateFuelMeasurement,
);

export const deleteFuelMeasurement = createAsyncThunk(
  "fuel/deleteFuelMeasurement",
  Api.deleteFuelMeasurement,
);

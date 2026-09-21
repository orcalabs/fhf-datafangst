import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "~/api";

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

export const getFuelMeasurementsAndBunkerings = createAsyncThunk(
  "fuel/getFuelMeasurementsAndBunkerings",
  Api.getFuelMeasurementsAndBunkerings,
);

export const createBunkering = createAsyncThunk(
  "fuel/createBunkering",
  Api.createBunkering,
);

export const updateBunkering = createAsyncThunk(
  "fuel/updateBunkering",
  Api.updateBunkering,
);

export const deleteBunkering = createAsyncThunk(
  "fuel/deleteBunkering",
  Api.deleteBunkering,
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getFuelMeasurements = createAsyncThunk(
  "user/getFuelMeasurements",
  Api.getFuelMeasurements,
);

export const createFuelMeasurement = createAsyncThunk(
  "user/createFuelMeasurement",
  Api.createFuelMeasurement,
);

export const updateFuelMeasurement = createAsyncThunk(
  "user/updateFuelMeasurement",
  Api.updateFuelMeasurement,
);

export const deleteFuelMeasurement = createAsyncThunk(
  "user/deleteFuelMeasurement",
  Api.deleteFuelMeasurement,
);

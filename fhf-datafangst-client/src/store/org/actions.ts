import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getOrgBenchmarks = createAsyncThunk(
  "org/getOrgBenchmarks",
  Api.getOrgBenchmarks,
);

export const getOrgFuelConsumption = createAsyncThunk(
  "org/getOrgFuelConsumption",
  Api.getOrgFuelConsumption,
);

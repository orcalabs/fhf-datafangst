import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getVessels = createAsyncThunk("vessel/getVessels", Api.getVessels);
export const getVesselBenchmarks = createAsyncThunk(
  "vessel/getVesselBenchmarks",
  Api.getVesselBenchmarks,
);

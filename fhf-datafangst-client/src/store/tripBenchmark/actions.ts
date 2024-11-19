import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getTripBenchmarks = createAsyncThunk(
  "tripBenchmark/getTripBenchmarks",
  Api.getTripBenchmarks,
);

export const getAverageTripBenchmarks = createAsyncThunk(
  "tripBenchmarks/getAverageTripBenchmarks",
  Api.getAverageTripBenchmarks,
);

export const getEeoi = createAsyncThunk("tripBenchmark/getEeoi", Api.getEeoi);

export const getAverageEeoi = createAsyncThunk(
  "tripBenchmarks/getAverageEeoi",
  Api.getAverageEeoi,
);

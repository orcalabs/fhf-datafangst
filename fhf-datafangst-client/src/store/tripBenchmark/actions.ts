import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getTripBenchmarks = createAsyncThunk(
  "tripBenchmark/getTripBenchmarks",
  Api.getTripBenchmarks,
);

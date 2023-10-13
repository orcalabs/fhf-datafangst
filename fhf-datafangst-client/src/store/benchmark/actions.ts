import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { BenchmarkModalParams } from "./state";

export const getBenchmarkData = createAsyncThunk("benchmark/getBenchmarkData", Api.getTrips);
export const setBenchmarkModal = createAction<BenchmarkModalParams | undefined>(
    "benchmark/setBenchmarkModal",
  );
export const setBenchmarkHistoric = createAction<[string, string[], number[]]>(
  "benchmark/setBenchmarkHistoric",
);

export const setBenchmarkMetric = createAction<string>(
  "benchmark/setBenchmarkMetric",
);
export const setBenchmarkDataSource = createAction<boolean>(
  "benchmark/setBenchmarkDataSource",
);

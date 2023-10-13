import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { BenchmarkDataSource, BenchmarkModalParams } from "./state";

export interface benchmarkHistoricParams {
  metric: string;
  xAxis: string[];
  data: number[];
}

export const getBenchmarkData = createAsyncThunk(
  "benchmark/getBenchmarkData",
  Api.getTrips,
);
export const setBenchmarkModal = createAction<BenchmarkModalParams | undefined>(
  "benchmark/setBenchmarkModal",
);
export const setBenchmarkHistoric = createAction<benchmarkHistoricParams>(
  "benchmark/setBenchmarkHistoric",
);

export const setBenchmarkMetric = createAction<string>(
  "benchmark/setBenchmarkMetric",
);
export const setBenchmarkDataSource = createAction<BenchmarkDataSource>(
  "benchmark/setBenchmarkDataSource",
);

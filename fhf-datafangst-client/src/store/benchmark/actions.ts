import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { BenchmarkDataSource, BenchmarkModalParams } from "./state";
import { Vessel } from "generated/openapi";

export interface BenchmarkHistoricParams {
  metric: string;
  xAxis: string[];
  data: Record<string, number[]>;
}

export const getBenchmarkData = createAsyncThunk(
  "benchmark/getBenchmarkData",
  Api.getTrips,
);
export const setBenchmarkModal = createAction<BenchmarkModalParams | undefined>(
  "benchmark/setBenchmarkModal",
);
export const setBenchmarkHistoric = createAction<BenchmarkHistoricParams>(
  "benchmark/setBenchmarkHistoric",
);

export const setBenchmarkDataSource = createAction<BenchmarkDataSource>(
  "benchmark/setBenchmarkDataSource",
);

export const clearBenchmarkData = createAction<Vessel>(
  "benchmark/clearBenchmarkData",
);

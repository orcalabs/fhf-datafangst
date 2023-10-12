import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getBenchmarkData = createAsyncThunk("benchmark/getBenchmarkData", Api.getTrips);
export const setBenchmarkModal = createAction<boolean>(
    "benchmark/setBenchmarkModal"
  );
export const setBenchmarkDataSource = createAction<boolean>(
    "benchmark/setBenchmarkDataSource"
  );
  

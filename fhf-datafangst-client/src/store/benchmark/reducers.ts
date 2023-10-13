import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { setBenchmarkDataSource, setBenchmarkHistoric, setBenchmarkMetric, setBenchmarkModal } from "./actions";

export const benchmarkBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(setBenchmarkModal, (state, action) => {
        state.benchmarkModal = action.payload;
    })
    .addCase(setBenchmarkHistoric, (state, action) => {
      state.benchmarkHistoric = action.payload[2];
      state.benchmarkXAxis = action.payload[1];
      state.benchmarkMetric = action.payload[0];
    })
    .addCase(setBenchmarkMetric, (state, action) => {
      state.benchmarkMetric = action.payload;
    })
    .addCase(setBenchmarkDataSource, (state, action) => {
      state.benchmarkDataSource = action.payload;
    });

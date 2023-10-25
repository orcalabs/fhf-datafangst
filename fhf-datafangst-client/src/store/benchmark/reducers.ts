import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import {
  getBenchmarkData,
  setBenchmarkDataSource,
  setBenchmarkHistoric,
  setBenchmarkModal,
} from "./actions";

export const benchmarkBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(setBenchmarkModal, (state, action) => {
      state.benchmarkModal = action.payload;
    })
    .addCase(setBenchmarkHistoric, (state, action) => {
      state.benchmarkHistoric = action.payload.data;
    })
    .addCase(setBenchmarkDataSource, (state, action) => {
      state.benchmarkDataSource = action.payload;
    })
    .addCase(getBenchmarkData.fulfilled, (state, action) => {
      state.benchmarkTrips[action.payload[0].fiskeridirVesselId] =
        action.payload;
    });

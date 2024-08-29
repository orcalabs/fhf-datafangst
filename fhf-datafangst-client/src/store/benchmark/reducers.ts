import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { Trip } from "generated/openapi";
import { AppState } from "store/state";
import {
  clearBenchmarkData,
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
    })
    .addCase(clearBenchmarkData, (state, action) => {
      const tmp: Record<number, Trip[]> = {};
      Object.keys(state.benchmarkTrips)
        .filter(
          (fiskeridirId) => +fiskeridirId !== action.payload.fiskeridir.id,
        )
        .forEach((fiskeridirId) => {
          tmp[+fiskeridirId] = state.benchmarkTrips[+fiskeridirId];
        });
      state.benchmarkTrips = tmp;
    });

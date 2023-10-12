import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getBenchmarkData, setBenchmarkDataSource, setBenchmarkModal ,} from "./actions";

export const benchmarkBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(setBenchmarkModal, (state, action) => {
        console.log("setting benchmark modal")
        state.benchmarkModal = action.payload
    })
    .addCase(setBenchmarkDataSource, (state, action) => {
        console.log("setting benchmark modal")
        state.benchmarkDataSource = action.payload
    })

import { createSelector } from "@reduxjs/toolkit";
import { selectAppState } from "store/selectors";

export const selectBenchmarkModal = createSelector(selectAppState, (state) => state.benchmarkModal);
export const selectBenchmarkNumHistoric = createSelector(selectAppState, (state) => state.benchmarkNumHistoric);

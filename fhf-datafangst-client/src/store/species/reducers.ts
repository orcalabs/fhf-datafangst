import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { AppState } from "~/store/state";
import {
  getConditions,
  getQualities,
  getSpecies,
  getSpeciesFao,
  getSpeciesFiskeridir,
  getSpeciesGroups,
  getSpeciesMainGroups,
} from "./actions";

export const speciesBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getSpecies.fulfilled, (state, action) => {
      state.species = action.payload;
    })
    .addCase(getSpeciesFao.fulfilled, (state, action) => {
      state.speciesFao = action.payload;
    })
    .addCase(getSpeciesFiskeridir.fulfilled, (state, action) => {
      state.speciesFiskeridir = action.payload;
    })
    .addCase(getSpeciesGroups.fulfilled, (state, action) => {
      state.speciesGroups = action.payload;
    })
    .addCase(getSpeciesMainGroups.fulfilled, (state, action) => {
      state.speciesMainGroups = action.payload;
    })
    .addCase(getConditions.fulfilled, (state, action) => {
      state.conditions = action.payload;
    })
    .addCase(getQualities.fulfilled, (state, action) => {
      state.qualities = action.payload;
    });

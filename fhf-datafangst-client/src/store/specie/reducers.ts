import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getSpecies, getSpecieGroups } from ".";

export const specieBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getSpecies.fulfilled, (state, action) => {
      state.species = action.payload;
    })
    .addCase(getSpecieGroups.fulfilled, (state, action) => {
      state.specieGroups = action.payload;
    });

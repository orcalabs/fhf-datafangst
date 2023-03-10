import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import {
  getSpecies,
  getSpeciesGroups,
  getSpeciesFao,
  getSpeciesFiskeridir,
  getSpeciesMainGroups,
} from ".";

export const specieBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getSpecies.fulfilled, (state, action) => {
      const species = action.payload;

      for (const s of species) {
        state.species[s.id] = s;
      }
    })
    .addCase(getSpeciesFao.fulfilled, (state, action) => {
      const speciesFao = action.payload;

      for (const s of speciesFao) {
        state.speciesFao[s.id] = s;
      }
    })
    .addCase(getSpeciesFiskeridir.fulfilled, (state, action) => {
      const speciesFiskeridir = action.payload;

      for (const s of speciesFiskeridir) {
        state.speciesFiskeridir[s.id] = s;
      }
    })
    .addCase(getSpeciesGroups.fulfilled, (state, action) => {
      const speciesGroups = action.payload;

      for (const s of speciesGroups) {
        state.speciesGroups[s.id] = s;
      }
    })
    .addCase(getSpeciesMainGroups.fulfilled, (state, action) => {
      const speciesMainGroups = action.payload;

      for (const s of speciesMainGroups) {
        state.speciesMainGroups[s.id] = s;
      }
    });

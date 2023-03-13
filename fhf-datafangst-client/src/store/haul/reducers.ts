import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { emptyState } from "store/reducers";
import { AppState } from "store/state";
import { getHauls, getHaulsGrid, setHaulsSearch, setSelectedHaul } from ".";

export const haulBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getHauls.pending, (state, _) => {
      state.haulsLoading = true;
      state.hauls = undefined;
    })
    .addCase(getHauls.fulfilled, (state, action) => {
      const hauls = action.payload;
      state.hauls = hauls;
      state.haulsByArea = {};

      for (const haul of hauls) {
        if (haul.catchLocationStart) {
          if (state.haulsByArea[haul.catchLocationStart]) {
            state.haulsByArea[haul.catchLocationStart].push(haul);
          } else {
            state.haulsByArea[haul.catchLocationStart] = [haul];
          }
        }
      }

      state.haulsLoading = false;
    })
    .addCase(getHauls.rejected, (state, _) => {
      state.haulsLoading = false;
    })
    .addCase(getHaulsGrid.pending, (state, _) => {
      state.haulsGridLoading = true;
      state.haulsGrid = undefined;
    })
    .addCase(getHaulsGrid.fulfilled, (state, action) => {
      state.haulsGrid = action.payload;
      state.haulsGridLoading = false;
    })
    .addCase(getHaulsGrid.rejected, (state, _) => {
      state.haulsGridLoading = false;
    })
    .addCase(setSelectedHaul, (state, action) => {
      state.selectedHaul = action.payload.haul;
    })
    .addCase(setHaulsSearch, (state, action) => {
      if (action.payload) {
        (action as any).asyncDispatch(
          getHaulsGrid({ ...action.payload, catchLocations: undefined }),
        );

        if (action.payload.catchLocations) {
          (action as any).asyncDispatch(getHauls({ ...action.payload }));
        }
      }

      return {
        ...state,
        ...emptyState,
        haulsSearch: action.payload,
      };
    });

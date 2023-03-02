import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { emptyState } from "store/reducers";
import { AppState } from "store/state";
import { getHauls, setHaulsSearch } from ".";

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
        if (haul.catchFieldStart) {
          if (state.haulsByArea[haul.catchFieldStart]) {
            state.haulsByArea[haul.catchFieldStart].push(haul);
          } else {
            state.haulsByArea[haul.catchFieldStart] = [haul];
          }
        }
      }

      state.haulsLoading = false;
    })
    .addCase(getHauls.rejected, (state, _) => {
      state.haulsLoading = false;
    })
    .addCase(setHaulsSearch, (state, action) => {
      if (action.payload) {
        (action as any).asyncDispatch(getHauls(action.payload));
      }
      console.log(action.payload);
      return {
        ...state,
        ...emptyState,
        haulsSearch: action.payload,
      };
    });

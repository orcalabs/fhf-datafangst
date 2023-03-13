import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { getAis, setAisSearch } from "./actions";
import { AppState } from "store/state";
import { emptyState } from "store";

export const aisBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getAis.pending, (state, _) => {
      state.aisLoading = true;
      state.ais = undefined;
    })
    .addCase(getAis.fulfilled, (state, action) => {
      state.aisLoading = false;
      const ais = action.payload;
      if (!ais) return;
      state.ais = ais;
    })
    .addCase(getAis.rejected, (state, _) => {
      state.aisLoading = false;
    })
    .addCase(setAisSearch, (state, action) => ({
      ...state,
      ...emptyState,
      ais: action.payload ? state.ais : undefined,
      aisSearch: action.payload,
    }));

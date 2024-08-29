import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import { getDeliveryPoints } from "./actions";

export const deliveryPointBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder.addCase(getDeliveryPoints.fulfilled, (state, action) => {
    state.deliveryPoints = action.payload;
  });

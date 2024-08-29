import { createSelector } from "@reduxjs/toolkit";
import { DeliveryPoint } from "generated/openapi";
import { selectAppState } from "store/selectAppState";

export const selectDeliveryPoints = createSelector(
  selectAppState,
  (state) => state.deliveryPoints,
);

export const selectDeliveryPointsSorted = createSelector(
  selectDeliveryPoints,
  (state) =>
    Array.from(state).sort((a, b) =>
      (a.name ?? a.id).localeCompare(b.name ?? b.id, "no"),
    ),
);

export const selectDeliveryPointsMap = createSelector(
  selectDeliveryPoints,
  (state) => {
    const res: Record<string, DeliveryPoint> = {};
    for (const dp of state) res[dp.id] = dp;
    return res;
  },
);

export const selectMapDeliveryPoints = createSelector(
  selectAppState,
  selectDeliveryPointsMap,
  (state, deliveryPoints) =>
    state.selectedTrip?.deliveryPointIds.map((i) => deliveryPoints[i]),
);

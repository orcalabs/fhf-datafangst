import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { getTrack } from "store";
import { HaulsFilter } from "api";
import { emptyState } from "store/reducers";
import { AppState } from "store/state";
import {
  getHauls,
  setHaulsMatrixSearch,
  setSelectedHaul,
  getHaulsMatrix,
  setHoveredFilter,
  getHaulsMatrix2,
  setHaulsMatrix2Search,
} from ".";
import { Haul } from "generated/openapi";

export const haulBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getHauls.pending, (state, _) => {
      state.haulsLoading = true;
      state.hauls = undefined;
    })
    .addCase(getHauls.fulfilled, (state, action) => {
      state.hauls = action.payload;
      state.haulsLoading = false;
    })
    .addCase(getHauls.rejected, (state, _) => {
      state.haulsLoading = false;
    })
    .addCase(getHaulsMatrix.pending, (state, _) => {
      state.haulsMatrix = undefined;
      state.haulsMatrixLoading = true;
    })
    .addCase(getHaulsMatrix.fulfilled, (state, action) => {
      state.haulsMatrix = action.payload;
      state.haulsMatrixLoading = false;
    })
    .addCase(getHaulsMatrix.rejected, (state, _) => {
      state.haulsMatrixLoading = false;
    })
    .addCase(getHaulsMatrix2.pending, (state, _) => {
      state.haulsMatrix2 = undefined;
      state.haulsMatrix2Loading = true;
    })
    .addCase(getHaulsMatrix2.fulfilled, (state, action) => {
      state.haulsMatrix2 = action.payload;
      state.haulsMatrix2Loading = false;
    })
    .addCase(getHaulsMatrix2.rejected, (state, _) => {
      state.haulsMatrix2Loading = false;
    })
    .addCase(setSelectedHaul, (state, action) => {
      const haul =
        typeof action.payload === "number"
          ? state.hauls?.[action.payload]
          : (action.payload as Haul);

      state.selectedHaul = haul;
      state.ais = undefined;
      state.vms = undefined;
      state.track = undefined;

      if (haul && state.vesselsByCallsign) {
        const vessel = state.vesselsByCallsign[haul.vesselCallSignErs];

        if (vessel) {
          (action as any).asyncDispatch(
            getTrack({
              mmsi: vessel.ais?.mmsi,
              callSign: vessel.fiskeridir.callSign,
              start: haul.startTimestamp,
              end: haul.stopTimestamp,
            }),
          );
        }
      }
    })
    .addCase(setHoveredFilter, (state, action) => {
      state.hoveredFilter = action.payload;
    })
    .addCase(setHaulsMatrixSearch, (state, action) => {
      if (
        action.payload.filter === undefined ||
        action.payload.filter !== state.hoveredFilter ||
        action.payload.filter === HaulsFilter.Vessel
      ) {
        action.payload.filter = state.hoveredFilter ?? HaulsFilter.VesselLength;
        (action as any).asyncDispatch(
          getHaulsMatrix({ ...action.payload, catchLocations: undefined }),
        );
      }

      return {
        ...state,
        ...emptyState,
        haulsMatrixSearch: action.payload,
      };
    })
    .addCase(setHaulsMatrix2Search, (state, action) => {
      if (
        action.payload.filter === undefined ||
        action.payload.filter !== state.hoveredFilter ||
        action.payload.filter === HaulsFilter.Vessel
      ) {
        action.payload.filter = state.hoveredFilter ?? HaulsFilter.VesselLength;
        (action as any).asyncDispatch(getHaulsMatrix2(action.payload));
      }

      (action as any).asyncDispatch(getHauls(action.payload));
      state.haulsMatrix2Search = action.payload;
    });

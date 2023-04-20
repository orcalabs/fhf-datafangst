import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { getTrack } from "store";
import { HaulsFilter } from "api";
import { emptyState } from "store/reducers";
import { AppState } from "store/state";
import {
  getHauls,
  setHaulsSearch,
  setSelectedHaul,
  getHaulsMatrix,
  setHoveredFilter,
} from ".";

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
    .addCase(setSelectedHaul, (state, action) => {
      const haul = action.payload.haul;
      state.selectedHaul = haul;
      state.ais = undefined;
      state.vms = undefined;

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
    .addCase(setHaulsSearch, (state, action) => {
      if (action.payload) {
        if (
          action.payload.filter === undefined ||
          action.payload.filter !== state.hoveredFilter ||
          action.payload.filter === HaulsFilter.Vessel
        ) {
          action.payload.filter =
            state.hoveredFilter ?? HaulsFilter.VesselLength;
          (action as any).asyncDispatch(
            getHaulsMatrix({ ...action.payload, catchLocations: undefined }),
          );
        }

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

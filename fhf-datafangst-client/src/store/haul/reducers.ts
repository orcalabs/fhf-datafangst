import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { HaulsFilter } from "api";
import { Haul } from "generated/openapi";
import { getTrack } from "store";
import { AppState, emptyState } from "store/state";
import {
  addHauls,
  getHauls,
  getHaulsMatrix,
  getHaulsMatrix2,
  removeHauls,
  setHaulDateSliderFrame,
  setHaulsMatrix2Search,
  setHaulsMatrixSearch,
  setHoveredHaulFilter,
  setSelectedHaul,
  setSelectedTripHaul,
} from "./actions";

export const haulBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getHauls.pending, (state, _) => {
      state.haulsLoading = true;
      state.hauls = undefined;
    })
    .addCase(getHauls.fulfilled, (state, action) => {
      state.hauls = {};
      for (const haul of action.payload) {
        state.hauls[haul.haulId] = haul;
      }
      state.haulsLoading = false;
    })
    .addCase(getHauls.rejected, (state, _) => {
      state.haulsLoading = false;
    })
    .addCase(addHauls.pending, (state, _) => {
      state.haulsLoading = true;
    })
    .addCase(addHauls.fulfilled, (state, action) => {
      const hauls = { ...state.hauls };
      for (const haul of action.payload) {
        hauls[haul.haulId] = haul;
      }
      state.hauls = hauls;
      state.haulsLoading = false;
    })
    .addCase(addHauls.rejected, (state, _) => {
      state.haulsLoading = false;
    })
    .addCase(removeHauls, (state, _) => {
      for (const key in state.hauls) {
        const haul = state.hauls[Number(key)];

        if (haul.catchLocations) {
          if (
            !haul.catchLocations.some((c) =>
              state.selectedGridsString.includes(c),
            )
          ) {
            // eslint-disable-next-line
            delete state.hauls[haul.haulId];
          }
        }
      }
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

      if (haul && state.vesselsByCallSign) {
        const vessel = state.vesselsByCallSign[haul.callSign];

        // NOTE: If vessels under 15m report ERS, add BW-token here
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
    .addCase(setSelectedTripHaul, (state, action) => {
      state.selectedTripHaul = action.payload;
    })
    .addCase(setHoveredHaulFilter, (state, action) => {
      state.hoveredHaulFilter = action.payload;
    })
    .addCase(setHaulsMatrixSearch, (state, action) => {
      if (
        action.payload.filter === undefined ||
        action.payload.filter !== state.hoveredHaulFilter ||
        action.payload.filter === HaulsFilter.Vessel
      ) {
        action.payload.filter =
          state.hoveredHaulFilter ?? HaulsFilter.VesselLength;
        (action as any).asyncDispatch(
          getHaulsMatrix({ ...action.payload, catchLocations: undefined }),
        );
      }

      return {
        ...state,
        ...emptyState,
        landingsMatrix: undefined,
        hauls: undefined,
        haulsMatrixSearch: action.payload,
        haulsMatrix2Search: undefined,
      };
    })
    .addCase(setHaulsMatrix2Search, (state, action) => {
      if (
        action.payload.filter === undefined ||
        action.payload.filter !== state.hoveredHaulFilter ||
        action.payload.filter === HaulsFilter.Vessel
      ) {
        action.payload.filter =
          state.hoveredHaulFilter ?? HaulsFilter.VesselLength;
        (action as any).asyncDispatch(getHaulsMatrix2(action.payload));
      }

      const cur = action.payload.catchLocations ?? [];
      const prev = state.haulsMatrix2Search?.catchLocations ?? [];

      if (cur.length < prev.length) {
        const x = prev.filter((c) => !cur.includes(c));
        (action as any).asyncDispatch(removeHauls(x));
      } else if (cur.length > prev.length) {
        const x = cur.filter((c) => !prev.includes(c));
        (action as any).asyncDispatch(
          addHauls({ ...action.payload, catchLocations: x }),
        );
      } else {
        (action as any).asyncDispatch(getHauls(action.payload));
      }

      state.haulsMatrix2Search = action.payload;
    })
    .addCase(setHaulDateSliderFrame, (state, action) => {
      state.haulDateSliderFrame = action.payload;
    });

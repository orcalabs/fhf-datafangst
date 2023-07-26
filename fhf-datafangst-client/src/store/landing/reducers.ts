import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { LandingsFilter } from "api";
import { emptyState } from "store/reducers";
import { AppState } from "store/state";
import {
  getLandings,
  setLandingsMatrixSearch,
  setSelectedLanding,
  getLandingsMatrix,
  setHoveredLandingFilter,
  getLandingsMatrix2,
  setLandingsMatrix2Search,
  removeLandings,
  addLandings,
  setSelectedTripLanding,
  setLandingDateSliderFrame,
} from ".";
import { Landing } from "generated/openapi";

export const landingBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getLandings.pending, (state, _) => {
      state.landingsLoading = true;
      state.landings = undefined;
    })
    .addCase(getLandings.fulfilled, (state, action) => {
      state.landings = {};
      for (const landing of action.payload) {
        state.landings[landing.landingId] = landing;
      }
      state.landingsLoading = false;
    })
    .addCase(getLandings.rejected, (state, _) => {
      state.landingsLoading = false;
    })
    .addCase(addLandings.pending, (state, _) => {
      state.landingsLoading = true;
    })
    .addCase(addLandings.fulfilled, (state, action) => {
      const landings = { ...state.landings };
      for (const landing of action.payload) {
        landings[landing.landingId] = landing;
      }
      state.landings = landings;
      state.landingsLoading = false;
    })
    .addCase(addLandings.rejected, (state, _) => {
      state.landingsLoading = false;
    })
    .addCase(removeLandings, (state, action) => {
      for (const key in state.landings) {
        const landing = state.landings[Number(key)];

        if (
          landing.catchLocation &&
          action.payload.includes(landing.catchLocation)
        ) {
          // eslint-disable-next-line
          delete state.landings[landing.landingId];
        }
      }
    })
    .addCase(getLandingsMatrix.pending, (state, _) => {
      state.landingsMatrix = undefined;
      state.landingsMatrixLoading = true;
    })
    .addCase(getLandingsMatrix.fulfilled, (state, action) => {
      state.landingsMatrix = action.payload;
      console.log(state.landingsMatrix);
      state.landingsMatrixLoading = false;
    })
    .addCase(getLandingsMatrix.rejected, (state, _) => {
      state.landingsMatrixLoading = false;
    })
    .addCase(getLandingsMatrix2.pending, (state, _) => {
      state.landingsMatrix2 = undefined;
      state.landingsMatrix2Loading = true;
    })
    .addCase(getLandingsMatrix2.fulfilled, (state, action) => {
      state.landingsMatrix2 = action.payload;
      state.landingsMatrix2Loading = false;
    })
    .addCase(getLandingsMatrix2.rejected, (state, _) => {
      state.landingsMatrix2Loading = false;
    })
    .addCase(setSelectedLanding, (state, action) => {
      const landing =
        typeof action.payload === "number"
          ? state.landings?.[action.payload]
          : (action.payload as Landing);

      state.selectedLanding = landing;
      state.ais = undefined;
      state.vms = undefined;
      state.track = undefined;
    })
    .addCase(setSelectedTripLanding, (state, action) => {
      state.selectedTripLanding = action.payload;
    })
    .addCase(setHoveredLandingFilter, (state, action) => {
      state.hoveredLandingFilter = action.payload;
    })
    .addCase(setLandingsMatrixSearch, (state, action) => {
      if (
        action.payload.filter === undefined ||
        action.payload.filter !== state.hoveredLandingFilter ||
        action.payload.filter === LandingsFilter.Vessel
      ) {
        action.payload.filter =
          state.hoveredLandingFilter ?? LandingsFilter.VesselLength;
        (action as any).asyncDispatch(
          getLandingsMatrix({ ...action.payload, catchLocations: undefined }),
        );
      }

      return {
        ...state,
        ...emptyState,
        haulsMatrix: undefined,
        landings: undefined,
        landingsMatrixSearch: action.payload,
        landingsMatrix2Search: undefined,
      };
    })
    .addCase(setLandingsMatrix2Search, (state, action) => {
      if (
        action.payload.filter === undefined ||
        action.payload.filter !== state.hoveredLandingFilter ||
        action.payload.filter === LandingsFilter.Vessel
      ) {
        action.payload.filter =
          state.hoveredLandingFilter ?? LandingsFilter.VesselLength;
        (action as any).asyncDispatch(getLandingsMatrix2(action.payload));
      }

      const cur = action.payload.catchLocations ?? [];
      const prev = state.landingsMatrix2Search?.catchLocations ?? [];

      if (cur.length < prev.length) {
        const x = prev.filter((c) => !cur.includes(c));
        (action as any).asyncDispatch(removeLandings(x));
      } else if (cur.length > prev.length) {
        const x = cur.filter((c) => !prev.includes(c));
        (action as any).asyncDispatch(
          addLandings({ ...action.payload, catchLocations: x }),
        );
      } else {
        (action as any).asyncDispatch(getLandings(action.payload));
      }

      state.landingsMatrix2Search = action.payload;
    })
    .addCase(setLandingDateSliderFrame, (state, action) => {
      state.landingDateSliderFrame = action.payload;
    });

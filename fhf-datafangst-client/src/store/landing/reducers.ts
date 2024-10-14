import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { LandingsFilter } from "api";
import { Landing, LandingsSorting, Ordering } from "generated/openapi";
import { AppState, emptyState } from "store/state";
import {
  getLandings,
  getLandingsMatrix,
  getLandingsMatrix2,
  setHoveredLandingFilter,
  setLandingDateSliderFrame,
  setLandingsMatrix2Search,
  setLandingsMatrixSearch,
  setLandingsSearch,
  setSelectedLanding,
  setSelectedTripLanding,
} from "./actions";

export const landingBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getLandings.pending, (state, _) => {
      state.landingsLoading = true;
      state.landings = undefined;
      state.selectedLanding = undefined;
    })
    .addCase(getLandings.fulfilled, (state, action) => {
      state.landings = action.payload;
      state.landingsLoading = false;
    })
    .addCase(getLandings.rejected, (state, _) => {
      state.landingsLoading = false;
    })
    .addCase(getLandingsMatrix.pending, (state, _) => {
      state.landingsMatrix = undefined;
      state.landingsMatrixLoading = true;
    })
    .addCase(getLandingsMatrix.fulfilled, (state, action) => {
      state.landingsMatrix = action.payload;
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
    .addCase(setLandingsSearch, (state, action) => {
      (action as any).asyncDispatch(
        getLandings({
          ...state.landingsMatrix2Search,
          ...action.payload,
        }),
      );
      state.landingsSearch = action.payload;
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

      state.landingsSearch = {
        sorting: LandingsSorting.LandingTimestamp,
        ordering: Ordering.Desc,
        limit: 10,
        ...state.landingsSearch,
        page: 0,
      };
      state.landingsMatrix2Search = action.payload;

      (action as any).asyncDispatch(
        getLandings({ ...action.payload, ...state.landingsSearch }),
      );
    })
    .addCase(setLandingDateSliderFrame, (state, action) => {
      state.landingDateSliderFrame = action.payload;
    });

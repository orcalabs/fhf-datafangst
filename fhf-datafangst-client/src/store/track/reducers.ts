import { ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";
import { AisVmsPosition } from "generated/openapi";
import { Map } from "ol";
import { boundingExtent } from "ol/extent";
import { AppState } from "store/state";
import { fromLonLat } from "utils";
import {
  getCurrentPositions,
  getCurrentTripTrack,
  getHaulTrack,
  getTrack,
} from "./actions";

// Set the map focus and zoom to a selected area surrounding a the track of a trip.
const setMapFocus = (map: Draft<Map>, track: AisVmsPosition[]) => {
  const coords = [];

  if (track) {
    for (const pos of track) {
      coords.push(fromLonLat(pos.lon, pos.lat));
    }
  }

  if (coords.length === 0) {
    return;
  }

  const extent = boundingExtent(coords);

  map.getView().fit(extent, { padding: [100, 500, 100, 500], maxZoom: 4 });
};

export const trackBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getTrack.pending, (state, action) => {
      action.meta.arg.accessToken = state.authUser?.access_token;
      state.trackLoading = true;
      state.track = undefined;
    })
    .addCase(getTrack.fulfilled, (state, action) => {
      state.trackLoading = false;
      const track = action.payload;
      if (!track) return;
      state.track = track;

      if (state.selectedTrip && track.length) {
        setMapFocus(state.map, track);
      }
    })
    .addCase(getTrack.rejected, (state, _) => {
      state.trackLoading = false;
    })
    .addCase(getHaulTrack, (state, action) => {
      const haul = action.payload;

      if (haul && state.vesselsByCallSign) {
        const vessel = state.vesselsByCallSign[haul.callSign];

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
    .addCase(getCurrentPositions.pending, (state, action) => {
      action.meta.arg.token = state.authUser?.access_token;
      if (!state.currentPositions) {
        state.currentPositionsLoading = true;
      }
    })
    .addCase(getCurrentPositions.fulfilled, (state, action) => {
      state.currentPositions = action.payload;
      state.currentPositionsLoading = false;
    })
    .addCase(getCurrentPositions.rejected, (state, _action) => {
      state.currentPositionsLoading = false;
    })
    .addCase(getCurrentTripTrack.pending, (state, action) => {
      action.meta.arg.accessToken = state.authUser?.access_token;
      state.trackLoading = action.meta.arg.loading;
      state.track = undefined;
    })
    .addCase(getCurrentTripTrack.fulfilled, (state, action) => {
      state.track = action.payload;
      state.trackLoading = false;
    })
    .addCase(getCurrentTripTrack.rejected, (state, _action) => {
      state.trackLoading = false;
    });

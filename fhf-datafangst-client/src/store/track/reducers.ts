import { ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";
import { AisVmsPosition } from "generated/openapi";
import { Map } from "ol";
import { boundingExtent } from "ol/extent";
import { AppState } from "store/state";
import { fromLonLat } from "utils";
import { getHaulTrack, getTrack, getTrackWithoutLoading } from "./actions";

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
    .addCase(getTrackWithoutLoading.fulfilled, (state, action) => {
      const track = action.payload;

      if (!track) return;

      const mmsi = action.meta.arg.mmsi;

      // Handlers for potential race conditions between user clicks and track fetch on intervals in LiveVesselsLayer.
      // Track without loader only applies to Live map, so if a trip has been selected, this track is not longer valid.
      if (state.selectedTrip) {
        return;
      }
      // If a different vessel is selected on live map during interval, discard track.
      if (state.selectedLiveVessel && state.selectedLiveVessel.mmsi !== mmsi) {
        return;
      }

      state.track = track;
    });

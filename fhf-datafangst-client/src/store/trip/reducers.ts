import { ActionReducerMapBuilder, current } from "@reduxjs/toolkit";
import { AppState } from "store/state";
import {
  getCurrentTrip,
  getCurrentTripTrack,
  getHaulTrip,
  getLandingTrip,
  getTrips,
  paginateTripsSearch,
  setSelectedTrip,
  setTripsSearch,
} from ".";
import { emptyState, getTrack } from "store";
import { TripsArgs } from "api";

export const tripBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getHaulTrip.fulfilled, (state, action) => {
      const trip = action.payload;
      state.selectedTrip = trip;

      if (trip && state.vesselsByFiskeridirId) {
        const vessel = state.vesselsByFiskeridirId[trip.fiskeridirVesselId];

        if (vessel) {
          (action as any).asyncDispatch(
            getTrack({
              mmsi: vessel.ais?.mmsi,
              callSign: vessel.fiskeridir.callSign,
              start: trip.start,
              end: trip.end,
            }),
          );
        }
      }
    })
    .addCase(getLandingTrip.fulfilled, (state, action) => {
      const trip = action.payload;
      state.selectedTrip = trip;

      if (trip && state.vesselsByFiskeridirId) {
        const vessel = state.vesselsByFiskeridirId[trip.fiskeridirVesselId];

        if (vessel) {
          (action as any).asyncDispatch(
            getTrack({
              mmsi: vessel.ais?.mmsi,
              callSign: vessel.fiskeridir.callSign,
              start: trip.start,
              end: trip.end,
            }),
          );
        }
      }
    })
    .addCase(getTrips.pending, (state, _) => {
      state.trips = undefined;
      state.tripsLoading = true;
    })
    .addCase(getTrips.fulfilled, (state, action) => {
      state.trips = action.payload;
      state.tripsLoading = false;
    })
    .addCase(getTrips.rejected, (state, _) => {
      state.tripsLoading = false;
    })
    .addCase(setSelectedTrip, (state, action) => {
      const trip = action.payload;
      state.selectedTrip = trip;

      if (trip && state.vesselsByFiskeridirId) {
        const vessel = state.vesselsByFiskeridirId[trip.fiskeridirVesselId];

        (action as any).asyncDispatch(
          getTrack({
            mmsi: vessel.ais?.mmsi,
            callSign: vessel.fiskeridir.callSign,
            start: trip.start,
            end: trip.end,
          }),
        );
      }
    })
    .addCase(setTripsSearch, (state, action) => {
      const newSearch = action.payload;

      if (newSearch) {
        newSearch.accessToken = state.authUser?.access_token;
        (action as any).asyncDispatch(getTrips(action.payload));
      }

      return {
        ...state,
        ...emptyState,
        tripsSearch: action.payload,
      };
    })
    .addCase(paginateTripsSearch, (state, action) => {
      state.tripsSearch!.offset = action.payload.offset;
      state.tripsSearch!.limit = action.payload.limit;

      (action as any).asyncDispatch(
        getTrips(current(state.tripsSearch) as TripsArgs),
      );
    })
    .addCase(getCurrentTrip.pending, (state, action) => {
      action.meta.arg.accessToken = state.authUser?.access_token;
      state.currentTrip = undefined;
      state.currentTripLoading = true;
    })
    .addCase(getCurrentTrip.fulfilled, (state, action) => {
      if (action.payload) {
        state.currentTrip = action.payload;
        (action as any).asyncDispatch(
          getTrack({
            mmsi: action.meta.arg.vessel.ais?.mmsi,
            callSign: action.meta.arg.vessel.fiskeridir.callSign,
            start: action.payload.departure,
            end: new Date().toISOString(),
          }),
        );
      }
      state.currentTripLoading = false;
    })
    .addCase(getCurrentTrip.rejected, (state, _) => {
      state.currentTripLoading = false;
    })
    .addCase(getCurrentTripTrack, (state, action) => {
      const callSign = state.bwProfile?.vesselInfo.ircs;
      const vessel = callSign ? state.vesselsByCallsign?.[callSign] : undefined;

      if (state.currentTrip && vessel) {
        (action as any).asyncDispatch(
          getTrack({
            mmsi: vessel.ais?.mmsi,
            callSign: vessel.fiskeridir.callSign,
            start: state.currentTrip.departure,
            end: new Date().toISOString(),
          }),
        );
      }
    });

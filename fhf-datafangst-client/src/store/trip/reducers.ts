import { ActionReducerMapBuilder, current } from "@reduxjs/toolkit";
import { TripsArgs } from "api";
import { GearGroupDetailed } from "generated/openapi";
import { AppState, emptyState } from "store/state";
import { getTrack } from "store/track";
import { getGearGroupsFromVessels } from "utils";
import {
  getCurrentTrip,
  getCurrentTripTrack,
  getHaulTrip,
  getLandingTrip,
  getTrips,
  getTripTrack,
  paginateTripsSearch,
  setSelectedTrip,
  setTripsSearch,
} from "./actions";
import { TripTrackIdentifier } from "./state";

export const tripBuilder = (
  builder: ActionReducerMapBuilder<AppState>,
): ActionReducerMapBuilder<AppState> =>
  builder
    .addCase(getHaulTrip.fulfilled, (state, action) => {
      const trip = action.payload;
      state.selectedTrip = trip;
      (action as any).asyncDispatch(getTripTrack({ trip }));
    })
    .addCase(getLandingTrip.fulfilled, (state, action) => {
      const trip = action.payload;
      state.selectedTrip = trip;

      (action as any).asyncDispatch(getTripTrack({ trip }));
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

      // Reset track if deselecting trip
      if (!trip) {
        state.track = undefined;
      }

      state.selectedTrip = trip;
      state.selectedTripHaul = undefined;

      if (!trip && state.currentTrip) {
        (action as any).asyncDispatch(getCurrentTripTrack());
      }
      if (trip) {
        (action as any).asyncDispatch(getTripTrack({ trip }));
      }
    })
    .addCase(setTripsSearch, (state, action) => {
      const newSearch = action.payload;

      // Remove gear filters that are not included in vessel filter
      if (newSearch.vessels?.length && newSearch.gearGroups?.length) {
        const newGearGroups: GearGroupDetailed[] = [];
        const vesselsGearGroups = getGearGroupsFromVessels(newSearch.vessels);
        for (const gg of newSearch.gearGroups) {
          if (vesselsGearGroups.includes(gg.id)) {
            newGearGroups.push(gg);
          }
        }
        newSearch.gearGroups = newGearGroups.length ? newGearGroups : undefined;
      }

      if (newSearch) {
        newSearch.accessToken = state.authUser?.access_token;
        (action as any).asyncDispatch(getTrips(action.payload));
      }
      return {
        ...state,
        ...emptyState,
        tripsSearch: action.payload,
        tripFiltersOpen: state.tripFiltersOpen,
      };
    })
    .addCase(paginateTripsSearch, (state, action) => {
      let flag = false;
      if (!state.tripsSearch) {
        state.tripsSearch = {};
        flag = true;
      }
      state.tripsSearch!.offset = action.payload.offset;
      state.tripsSearch!.limit = action.payload.limit;

      (action as any).asyncDispatch(
        getTrips(
          flag ? state.tripsSearch : (current(state.tripsSearch) as TripsArgs),
        ),
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
            accessToken: state.authUser?.access_token,
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
    .addCase(getTripTrack, (state, action) => {
      const { trip, identifier } = action.payload;

      if (identifier) {
        state.tripTrackIdentifier = identifier;
      }

      if (state.tripTrackIdentifier === TripTrackIdentifier.MmsiCallSign) {
        const vessel = state.vesselsByFiskeridirId![trip.fiskeridirVesselId]!;
        (action as any).asyncDispatch(
          getTrack({
            accessToken: state.authUser?.access_token,
            mmsi: vessel.ais?.mmsi,
            callSign: vessel.fiskeridir.callSign,
            start: trip.start,
            end: trip.end,
          }),
        );
      } else {
        (action as any).asyncDispatch(
          getTrack({
            accessToken: state.authUser?.access_token,
            tripId: trip.tripId,
          }),
        );
      }
    })
    .addCase(getCurrentTripTrack, (state, action) => {
      const callSign = state.bwUser?.fiskInfoProfile.ircs;
      const vessel = callSign ? state.vesselsByCallSign?.[callSign] : undefined;

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

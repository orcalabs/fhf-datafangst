import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { Trip } from "generated/openapi";
import { TripTrackIdentifier } from "./state";

export const getTrip = createAsyncThunk("trip/getTrip", Api.getTrip);

export const getTrips = createAsyncThunk("trip/getTrips", Api.getTrips);

export const getCurrentTrip = createAsyncThunk(
  "trip/getCurrentTrip",
  Api.getCurrentTrip,
);

export const getTripTrack = createAction<{
  trip: Trip;
  identifier?: TripTrackIdentifier;
}>("trip/getTripTrack");

export const setSelectedTrip = createAction<Trip | undefined>(
  "trip/setSelectedTrip",
);

export const setTripsSearch = createAction<Api.TripsArgs>(
  "trip/setTripsSearch",
);

export const paginateTripsSearch = createAction<{
  offset: number;
  limit: number;
}>("trip/paginateTripsSearch");

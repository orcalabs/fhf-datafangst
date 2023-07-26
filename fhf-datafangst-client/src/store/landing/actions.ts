import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { LandingsArgs, LandingsFilter } from "api";
import { Landing } from "generated/openapi";

export const getLandings = createAsyncThunk(
  "landing/getLandings",
  Api.getLandings,
);

export const addLandings = createAsyncThunk(
  "landing/addLandings",
  Api.getLandings,
);

export const removeLandings = createAction<string[]>("landing/removeLandings");

export const getLandingsMatrix = createAsyncThunk(
  "landing/getLandingsMatrix",
  Api.getLandingsMatrix,
);

export const getLandingsMatrix2 = createAsyncThunk(
  "landing/getLandingsMatrix2",
  Api.getLandingsMatrix,
);

export const setLandingsMatrixSearch = createAction<LandingsArgs>(
  "landing/setLandingsMatrixSearch",
);

export const setLandingsMatrix2Search = createAction<LandingsArgs>(
  "landing/setLandingsMatrix2Search",
);

export const setLandingDateSliderFrame = createAction<Date | undefined>(
  "landing/setLandingDateSliderFrame",
);

export const setSelectedLanding = createAction<Landing | number | undefined>(
  "landing/setSelectedLanding",
);

export const setHoveredLandingFilter = createAction<LandingsFilter | undefined>(
  "landing/setHoveredLandingFilter",
);

export const setSelectedTripLanding = createAction<Landing | undefined>(
  "landing/setSelectedTripLanding",
);

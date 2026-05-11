import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { LandingsArgs, LandingsMatrixArgs } from "~/api";
import * as Api from "~/api";
import type { Landing } from "~/generated/openapi";

export const getLandings = createAsyncThunk(
  "landing/getLandings",
  Api.getLandings,
);

export const getLandingsMatrix = createAsyncThunk(
  "landing/getLandingsMatrix",
  Api.getLandingsMatrix,
);

export const getLandingsMatrix2 = createAsyncThunk(
  "landing/getLandingsMatrix2",
  Api.getLandingsMatrix,
);

export const setLandingsSearch = createAction<LandingsArgs>(
  "landing/setLandingsSearch",
);

export const setLandingsMatrixSearch = createAction<LandingsMatrixArgs>(
  "landing/setLandingsMatrixSearch",
);

export const setLandingsMatrix2Search = createAction<LandingsMatrixArgs>(
  "landing/setLandingsMatrix2Search",
);

export const setLandingDateSliderFrame = createAction<Date | undefined>(
  "landing/setLandingDateSliderFrame",
);

export const setSelectedLanding = createAction<Landing | number | undefined>(
  "landing/setSelectedLanding",
);

export const setSelectedTripLanding = createAction<Landing | undefined>(
  "landing/setSelectedTripLanding",
);

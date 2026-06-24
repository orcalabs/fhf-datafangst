import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { HaulsMatrixArgs } from "~/api";
import * as Api from "~/api";
import type { Haul, TripsDetailedHaul } from "~/generated/openapi";

export const getHauls = createAsyncThunk("haul/getHauls", Api.getHauls);

export const addHauls = createAsyncThunk("haul/addHauls", Api.getHauls);

export const removeHauls = createAction<string[]>("haul/removeHauls");

export const getHaulsMatrix = createAsyncThunk(
  "haul/getHaulsMatrix",
  Api.getHaulsMatrix,
);

export const getHaulsMatrix2 = createAsyncThunk(
  "haul/getHaulsMatrix2",
  Api.getHaulsMatrix,
);

export const setHaulsMatrixSearch = createAction<HaulsMatrixArgs>(
  "haul/setHaulsMatrixSearch",
);

export const setHaulsMatrix2Search = createAction<HaulsMatrixArgs>(
  "haul/setHaulsMatrix2Search",
);

export const setHaulDateSliderFrame = createAction<Date | undefined>(
  "haul/setHaulDateSliderFrame",
);

export const setSelectedHaul = createAction<Haul | number | undefined>(
  "haul/setSelectedHaul",
);

export const setSelectedTripHaul = createAction<TripsDetailedHaul | undefined>(
  "haul/setSelectedTripHaul",
);

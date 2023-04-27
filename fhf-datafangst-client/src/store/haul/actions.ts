import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { HaulsArgs, HaulsFilter } from "api";
import { Haul } from "generated/openapi";

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

export const setHaulsMatrixSearch = createAction<HaulsArgs>(
  "haul/setHaulsMatrixSearch",
);

export const setHaulsMatrix2Search = createAction<HaulsArgs>(
  "haul/setHaulsMatrix2Search",
);

export const setSelectedHaul = createAction<Haul | number | undefined>(
  "haul/setSelectedHaul",
);

export const setHoveredFilter = createAction<HaulsFilter>(
  "haul/setHoveredFilter",
);

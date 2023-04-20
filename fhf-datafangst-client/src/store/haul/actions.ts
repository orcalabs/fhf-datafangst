import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { HaulsArgs, HaulsFilter } from "api";
import { Haul } from "generated/openapi";

export const getHauls = createAsyncThunk("haul/getHauls", Api.getHauls);

export const getHaulsMatrix = createAsyncThunk(
  "haul/getHaulsMatrix",
  Api.getHaulsMatrix,
);

export const setHaulsSearch = createAction<HaulsArgs>("haul/setHaulsSearch");

export const setSelectedHaul = createAction<Haul | number | undefined>(
  "haul/setSelectedHaul",
);

export const setHoveredFilter = createAction<HaulsFilter>(
  "haul/setHoveredFilter",
);

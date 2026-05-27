import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "~/api";

export const getSpecies = createAsyncThunk(
  "species/getSpecies",
  Api.getSpecies,
);

export const getSpeciesFao = createAsyncThunk(
  "species/getSpeciesFao",
  Api.getSpeciesFao,
);

export const getSpeciesFiskeridir = createAsyncThunk(
  "species/getSpeciesFiskeridir",
  Api.getSpeciesFiskeridir,
);

export const getSpeciesGroups = createAsyncThunk(
  "species/getSpeciesGroups",
  Api.getSpeciesGroups,
);

export const getSpeciesMainGroups = createAsyncThunk(
  "species/getSpeciesMainGroups",
  Api.getSpeciesMainGroups,
);

export const getConditions = createAsyncThunk(
  "species/getConditions",
  Api.getConditions,
);

export const getQualities = createAsyncThunk(
  "species/getQualities",
  Api.getQualities,
);

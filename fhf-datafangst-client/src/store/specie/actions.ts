import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getSpecies = createAsyncThunk("specie/getSpecies", Api.getSpecies);

export const getSpeciesFao = createAsyncThunk(
  "specie/getSpeciesFao",
  Api.getSpeciesFao,
);

export const getSpeciesFiskeridir = createAsyncThunk(
  "specie/getSpeciesFiskeridir",
  Api.getSpeciesFiskeridir,
);

export const getSpeciesGroups = createAsyncThunk(
  "specie/getSpeciesGroups",
  Api.getSpeciesGroups,
);

export const getSpeciesMainGroups = createAsyncThunk(
  "specie/getSpeciesMainGroups",
  Api.getSpeciesMainGroups,
);

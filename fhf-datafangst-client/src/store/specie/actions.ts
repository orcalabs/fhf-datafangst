import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

export const getSpecies = createAsyncThunk(
  "specie/getSpecies",
  api.species.getSpecies,
);

export const getSpeciesFao = createAsyncThunk(
  "specie/getSpeciesFao",
  api.species.getSpeciesFao,
);

export const getSpeciesFiskeridir = createAsyncThunk(
  "specie/getSpeciesFiskeridir",
  api.species.getSpeciesFiskeridir,
);

export const getSpeciesGroups = createAsyncThunk(
  "specie/getSpeciesGroups",
  api.species.getSpeciesGroups,
);

export const getSpeciesMainGroups = createAsyncThunk(
  "specie/getSpeciesMainGroups",
  api.species.getSpeciesMainGroups,
);

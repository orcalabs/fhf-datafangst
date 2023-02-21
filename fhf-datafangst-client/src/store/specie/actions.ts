import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

export const getSpecies = createAsyncThunk(
  "specie/getSpecies",
  api.species.getSpecies,
);

export const getSpecieGroups = createAsyncThunk(
  "specie/getSpecieGroups",
  api.species.getSpecieGroups,
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

export const getGear = createAsyncThunk("gear/getGear", api.gears.getGear);

export const getGearGroups = createAsyncThunk(
  "gear/getGearGroups",
  api.gears.getGearGroups,
);

export const getGearMainGroups = createAsyncThunk(
  "gear/getGearMainGroups",
  api.gears.getGearMainGroups,
);

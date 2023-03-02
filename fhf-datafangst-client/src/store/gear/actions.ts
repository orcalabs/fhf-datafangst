import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getGear = createAsyncThunk("gear/getGear", Api.getGear);

export const getGearGroups = createAsyncThunk(
  "gear/getGearGroups",
  Api.getGearGroups,
);

export const getGearMainGroups = createAsyncThunk(
  "gear/getGearMainGroups",
  Api.getGearMainGroups,
);

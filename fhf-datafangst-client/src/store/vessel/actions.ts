import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Vessel } from "models";
import api from "api";

export const getVessels = createAsyncThunk(
  "vessel/getVessels",
  api.vessels.getVessels
);

export const setSelectedVessel = createAction<Vessel | undefined>(
  "vessel/setSelectedVessel"
);

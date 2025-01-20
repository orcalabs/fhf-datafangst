import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { CurrentAisPosition } from "generated/openapi";

export const getVessels = createAsyncThunk("vessel/getVessels", Api.getVessels);

export const getVesselBenchmarks = createAsyncThunk(
  "vessel/getVesselBenchmarks",
  Api.getVesselBenchmarks,
);

export const getEstimatedFuelConsumption = createAsyncThunk(
  "vessel/getEstimatedFuelConsumption",
  Api.getEstimatedFuelConsumption,
);

export const setSelectedLiveVessel = createAction<
  CurrentAisPosition | undefined
>("vessel/setSelectedLiveVessel");
